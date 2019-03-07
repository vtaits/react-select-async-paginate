import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SelectBase, components as defaultComponents } from 'react-select';

import defaultShouldLoadMore from './default-should-load-more';
import defaultReduceOptions from './default-reduce-options';

import wrapMenuList from './wrap-menu-list';

export const MenuList = wrapMenuList(defaultComponents.MenuList);

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

// Supports forwardRef https://github.com/facebook/prop-types/issues/200
const ComponentPropType = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.string,
  PropTypes.shape({ render: PropTypes.func.isRequired }),
]);

class AsyncPaginate extends Component {
  static propTypes = {
    loadOptions: PropTypes.func.isRequired,
    debounceTimeout: PropTypes.number,
    shouldLoadMore: PropTypes.func,

    options: PropTypes.arrayOf(PropTypes.object),
    // eslint-disable-next-line react/forbid-prop-types
    additional: PropTypes.any,
    reduceOptions: PropTypes.func,

    SelectComponent: ComponentPropType,
    components: PropTypes.objectOf(PropTypes.func),

    onMenuOpen: PropTypes.func,
    onMenuClose: PropTypes.func,

    // eslint-disable-next-line react/forbid-prop-types
    cacheUniq: PropTypes.any,

    selectRef: PropTypes.func,
  };

  static defaultProps = {
    debounceTimeout: 0,
    shouldLoadMore: defaultShouldLoadMore,

    options: null,
    additional: null,
    reduceOptions: defaultReduceOptions,

    SelectComponent: SelectBase,
    components: {},

    cacheUniq: null,

    selectRef: () => { },
  };

  constructor(props) {
    super(props);

    const initialOptionsCache = props.options
      ? {
        '': {
          isFirstLoad: false,
          isLoading: false,
          options: props.options,
          hasMore: true,
          additional: props.additional,
        },
      }
      : {};

    this.state = {
      search: '',
      optionsCache: initialOptionsCache,
      menuIsOpen: false,
    };
  }

  componentDidUpdate(oldProps) {
    const {
      cacheUniq,
    } = this.props;

    if (oldProps.cacheUniq !== cacheUniq) {
      this.setState({
        optionsCache: {},
      });
    }
  }

  getInitialCache() {
    const {
      additional,
    } = this.props;

    return {
      isFirstLoad: true,
      options: [],
      hasMore: true,
      isLoading: false,
      additional,
    };
  }

  onMenuClose = () => {
    const {
      onMenuClose,
    } = this.props;

    this.setState({
      search: '',
      menuIsOpen: false,
    });

    if (onMenuClose) {
      onMenuClose.call(this);
    }
  }

  onMenuOpen = async () => {
    const {
      onMenuOpen,
    } = this.props;

    await this.setState({
      menuIsOpen: true,
    });

    const {
      optionsCache,
    } = this.state;

    if (!optionsCache['']) {
      await this.loadOptions();
    }

    if (onMenuOpen) {
      onMenuOpen.call(this);
    }
  }

  onInputChange = async (search) => {
    await this.setState({
      search,
    });

    const {
      optionsCache,
    } = this.state;

    if (!optionsCache[search]) {
      await this.loadOptions();
    }
  }

  handleScrolledToBottom = async () => {
    const {
      search,
      optionsCache,
    } = this.state;

    const currentOptions = optionsCache[search];

    if (currentOptions) {
      await this.loadOptions();
    }
  }

  async loadOptions() {
    const {
      search,
      optionsCache,
    } = this.state;

    const currentOptions = optionsCache[search] || this.getInitialCache();

    if (currentOptions.isLoading || !currentOptions.hasMore) {
      return;
    }

    await this.setState((prevState) => ({
      search,
      optionsCache: {
        ...prevState.optionsCache,
        [search]: {
          ...currentOptions,
          isLoading: true,
        },
      },
    }));

    const {
      debounceTimeout,
    } = this.props;

    if (debounceTimeout > 0) {
      await sleep(debounceTimeout);

      const {
        search: newSearch,
      } = this.state;

      if (search !== newSearch) {
        return;
      }
    }

    let hasError;
    let additional;
    let options;
    let hasMore;

    try {
      const {
        loadOptions,
      } = this.props;

      const response = await loadOptions(
        search,
        currentOptions.options,
        currentOptions.additional,
      );

      ({ options, hasMore, additional } = response);

      hasError = false;
    } catch (e) {
      hasError = true;
    }

    if (hasError) {
      await this.setState((prevState) => ({
        optionsCache: {
          ...prevState.optionsCache,
          [search]: {
            ...currentOptions,
            isLoading: false,
          },
        },
      }));
    } else {
      const newAdditional = typeof additional === 'undefined' ? null : additional;

      const {
        reduceOptions,
      } = this.props;

      await this.setState((prevState) => ({
        optionsCache: {
          ...prevState.optionsCache,
          [search]: {
            ...currentOptions,
            options: reduceOptions(currentOptions.options, options, newAdditional),
            hasMore: !!hasMore,
            isLoading: false,
            isFirstLoad: false,
            additional: newAdditional,
          },
        },
      }));
    }
  }

  render() {
    const {
      selectRef,
      components,
      SelectComponent,
      ...props
    } = this.props;

    const {
      search,
      optionsCache,
      menuIsOpen,
    } = this.state;

    const currentOptions = optionsCache[search] || this.getInitialCache();

    return (
      <SelectComponent
        {...props}
        inputValue={search}
        menuIsOpen={menuIsOpen}
        onMenuClose={this.onMenuClose}
        onMenuOpen={this.onMenuOpen}
        onInputChange={this.onInputChange}
        onMenuScrollToBottom={this.handleScrolledToBottom}
        handleScrolledToBottom={this.handleScrolledToBottom}
        isLoading={currentOptions.isLoading}
        isFirstLoad={currentOptions.isFirstLoad}
        options={currentOptions.options}
        components={{
          MenuList,
          ...components,
        }}
        ref={selectRef}
      />
    );
  }
}

export default AsyncPaginate;
