import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SelectBase, components as defaultComponents } from 'react-select';

import wrapMenuList from './wrap-menu-list';

const initialCache = {
  isFirstLoad: true,
  options: [],
  hasMore: true,
  isLoading: false,
};

export const MenuList = wrapMenuList(defaultComponents.MenuList);

class AsyncPaginate extends Component {
  static propTypes = {
    loadOptions: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    cacheUniq: PropTypes.any,
    selectRef: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.object),
    components: PropTypes.objectOf(PropTypes.func),
  };

  static defaultProps = {
    cacheUniq: null,
    selectRef: () => { },
    options: null,
    components: {},
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

  onMenuClose = () => {
    this.setState({
      search: '',
      menuIsOpen: false,
    });
  }

  onMenuOpen = async () => {
    await this.setState({
      menuIsOpen: true,
    });

    const {
      optionsCache,
    } = this.state;

    if (!optionsCache['']) {
      await this.loadOptions();
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

    const currentOptions = optionsCache[search] || initialCache;

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

    let hasError;
    let options;
    let hasMore;

    try {
      const {
        loadOptions,
      } = this.props;

      const response = await loadOptions(search, currentOptions.options);

      ({ options, hasMore } = response);

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
      await this.setState((prevState) => ({
        optionsCache: {
          ...prevState.optionsCache,
          [search]: {
            ...currentOptions,
            options: currentOptions.options.concat(options),
            hasMore: !!hasMore,
            isLoading: false,
            isFirstLoad: false,
          },
        },
      }));
    }
  }

  render() {
    const {
      selectRef,
      components,
    } = this.props;

    const {
      search,
      optionsCache,
      menuIsOpen,
    } = this.state;

    const currentOptions = optionsCache[search] || initialCache;

    return (
      <SelectBase
        {...this.props}
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
