import React, { Component } from 'react';

import AsyncPaginate from 'react-select-async-paginate';

const options = [];
for (let i = 0; i < 50; ++i) {
  options.push({
    value: i + 1,
    label: `Option ${i + 1}`,
  });
}

const initialOptions = options.slice(0, 10);

const wrapperStyle = {
  maxWidth: '200px',
  marginBottom: '20px',
};

const loadOptions = (search, prevOptions) => new Promise((resolve) => {
  let filteredOptions;
  if (!search) {
    filteredOptions = options;
  } else {
    const searchLower = search.toLowerCase();

    filteredOptions = options.filter(({
      label,
    }) => label.toLowerCase().includes(searchLower));
  }

  const hasMore = filteredOptions.length > prevOptions.length + 10;
  const slicedOptions = filteredOptions.slice(
    prevOptions.length, prevOptions.length + 10);

  setTimeout(() => {
    resolve({
      options: slicedOptions,
      hasMore,
    });
  }, 1000);
});

class Page extends Component {
  state = {
    value1: null,
    value2: null,
    value3: null,
  }

  setValue1 = (value1) => {
    this.setState({
      value1,
    });
  }

  setValue2 = (value2) => {
    this.setState({
      value2,
    });
  }

  setValue3 = (value3) => {
    this.setState({
      value3,
    });
  }

  render() {
    const {
      value1,
      value2,
      value3,
    } = this.state;

    return (
      <div>
        <h1>Async Select with pagination</h1>

        <h2>Single select</h2>

        <div style={wrapperStyle}>
          <AsyncPaginate
            debounceTimeout={300}
            value={value1}
            loadOptions={loadOptions}
            onChange={this.setValue1}
          />
        </div>

        <h2>Multiple select</h2>

        <div style={wrapperStyle}>
          <AsyncPaginate
            debounceTimeout={300}
            isMulti
            value={value2}
            loadOptions={loadOptions}
            onChange={this.setValue2}
          />
        </div>

        <h2>With initial options</h2>

        <div style={wrapperStyle}>
          <AsyncPaginate
            debounceTimeout={300}
            value={value3}
            loadOptions={loadOptions}
            onChange={this.setValue3}
            options={initialOptions}
          />
        </div>
      </div>
    );
  }
}

export default Page;
