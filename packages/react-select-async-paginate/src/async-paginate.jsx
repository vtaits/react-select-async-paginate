import React, { Component } from 'react';

import AsyncPaginateBase from './async-paginate-base';

class AsyncPaginate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      menuIsOpen: false,
    };
  }

  onInputChange = async (inputValue) => {
    await this.setState({
      inputValue,
    });
  }

  onMenuClose = async () => {
    await this.setState({
      menuIsOpen: false,
    });
  }

  onMenuOpen = async () => {
    await this.setState({
      menuIsOpen: true,
    });
  }

  render() {
    const {
      inputValue,
      menuIsOpen,
    } = this.state;

    return (
      <AsyncPaginateBase
        {...this.props}
        inputValue={inputValue}
        menuIsOpen={menuIsOpen}
        onInputChange={this.onInputChange}
        onMenuClose={this.onMenuClose}
        onMenuOpen={this.onMenuOpen}
      />
    );
  }
}

export default AsyncPaginate;
