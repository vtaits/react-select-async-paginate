import React, { Component } from 'react';

import AsyncPaginateBase from './async-paginate-base';

class AsyncPaginate extends Component {
  state = {
    inputValue: '',
  }

  onInputChange = async (inputValue) => {
    await this.setState({
      inputValue,
    });
  }

  render() {
    const {
      inputValue,
    } = this.state;

    return (
      <AsyncPaginateBase
        {...this.props}
        inputValue={inputValue}
        onInputChange={this.onInputChange}
      />
    );
  }
}

export default AsyncPaginate;
