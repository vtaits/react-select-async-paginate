import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SelectBase } from 'react-select';

const initialCache = {
  options: [],
  hasMore: true,
  isLoading: false,
};

class AsyncPaginate extends Component {
  static propTypes = {
    loadOptions: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    cacheUniq: PropTypes.any,
    selectRef: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    cacheUniq: null,
    selectRef: () => {},
    options: null,
  };

  constructor(props) {
    super(props);

    const initialOptionsCache = props.options
      ? {
        '': {
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

  onMenuScrollToBottom = async () => {
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

    try {
      const {
        loadOptions,
      } = this.props;

      const {
        options,
        hasMore,
      } = await loadOptions(search, currentOptions.options);

      await this.setState((prevState) => ({
        optionsCache: {
          ...prevState.optionsCache,
          [search]: {
            ...currentOptions,
            options: currentOptions.options.concat(options),
            hasMore: !!hasMore,
            isLoading: false,
          },
        },
      }));
    } catch (e) {
      await this.setState((prevState) => ({
        optionsCache: {
          ...prevState.optionsCache,
          [search]: {
            ...currentOptions,
            isLoading: false,
          },
        },
      }));
    }
  }

  render() {
    const {
      selectRef,
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
        onMenuScrollToBottom={this.onMenuScrollToBottom}
        isLoading={currentOptions.isLoading}
        options={currentOptions.options}
        ref={selectRef}
      />
    );
  }
}

export default AsyncPaginate;
