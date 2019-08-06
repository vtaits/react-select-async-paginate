import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Select, { components as defaultComponents } from 'react-select';

import defaultShouldLoadMore from './default-should-load-more';
import defaultReduceOptions from './default-reduce-options';

import wrapMenuList from './wrap-menu-list';

export const MenuList = wrapMenuList(defaultComponents.MenuList);

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

class AsyncPaginateBase extends Component {
  static propTypes = {
    loadOptions: PropTypes.func.isRequired,
    debounceTimeout: PropTypes.number,
    shouldLoadMore: PropTypes.func,
    inputValue: PropTypes.string.isRequired,
    menuIsOpen: PropTypes.bool.isRequired,

    options: PropTypes.arrayOf(PropTypes.object),
    defaultOptions: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.object),
    ]),

    // eslint-disable-next-line react/forbid-prop-types
    additional: PropTypes.any,
    reduceOptions: PropTypes.func,

    SelectComponent: PropTypes.elementType,
    components: PropTypes.objectOf(PropTypes.func),
    filterOption: PropTypes.func,

    onInputChange: PropTypes.func.isRequired,

    // eslint-disable-next-line react/forbid-prop-types
    cacheUniq: PropTypes.any,

    selectRef: PropTypes.func,
  };

  static defaultProps = {
    debounceTimeout: 0,
    shouldLoadMore: defaultShouldLoadMore,

    options: null,
    defaultOptions: false,
    additional: null,
    reduceOptions: defaultReduceOptions,

    SelectComponent: Select,
    components: {},
    filterOption: null,

    cacheUniq: null,

    selectRef: Function.prototype,
  };

  constructor(props) {
    super(props);

    const {
      options,
      defaultOptions,
    } = props;

    const initialOptions = defaultOptions === true
      ? null
      : (defaultOptions instanceof Array)
        ? defaultOptions
        : options;

    const initialOptionsCache = initialOptions
      ? {
        '': {
          isFirstLoad: false,
          isLoading: false,
          options: initialOptions,
          hasMore: true,
          additional: props.additional,
        },
      }
      : {};

    this.state = {
      optionsCache: initialOptionsCache,
    };
  }

  async componentDidMount() {
    const {
      defaultOptions,
    } = this.props;

    if (defaultOptions === true) {
      await this.loadOptions();
    }
  }

  async componentDidUpdate(oldProps) {
    const {
      cacheUniq,
      defaultOptions,
      inputValue,
      menuIsOpen,
    } = this.props;

    if (oldProps.cacheUniq !== cacheUniq) {
      this.setState({
        optionsCache: {},
      });
      if (defaultOptions === true) {
        await this.loadOptions();
      }
    } else {
      if (inputValue !== oldProps.inputValue) {
        this.handleInputChange(inputValue);
      }

      if (menuIsOpen && !oldProps.menuIsOpen) {
        this.onMenuOpen();
      }
    }
  }

  async onMenuOpen() {
    const {
      optionsCache,
    } = this.state;

    if (!optionsCache['']) {
      await this.loadOptions();
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

  handleScrolledToBottom = async () => {
    const {
      inputValue,
    } = this.props;
    const {
      optionsCache,
    } = this.state;

    const currentOptions = optionsCache[inputValue];

    if (currentOptions) {
      await this.loadOptions();
    }
  }

  async handleInputChange(search) {
    const {
      optionsCache,
    } = this.state;

    if (!optionsCache[search]) {
      await this.loadOptions();
    }
  }

  async loadOptions() {
    const {
      inputValue,
    } = this.props;
    const {
      optionsCache,
    } = this.state;

    const currentOptions = optionsCache[inputValue] || this.getInitialCache();

    if (currentOptions.isLoading || !currentOptions.hasMore) {
      return;
    }

    await this.setState((prevState) => ({
      optionsCache: {
        ...prevState.optionsCache,
        [inputValue]: {
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
        inputValue: newInputValue,
      } = this.props;

      if (inputValue !== newInputValue) {
        await this.setState((prevState) => ({
          optionsCache: {
            ...prevState.optionsCache,
            [inputValue]: {
              ...prevState.optionsCache[inputValue],
              isLoading: false,
            },
          },
        }));

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
        inputValue,
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
          [inputValue]: {
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
          [inputValue]: {
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
      inputValue,
      ...props
    } = this.props;

    const {
      optionsCache,
    } = this.state;

    const currentOptions = optionsCache[inputValue] || this.getInitialCache();

    return (
      <SelectComponent
        {...props}
        inputValue={inputValue}
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

export default AsyncPaginateBase;
