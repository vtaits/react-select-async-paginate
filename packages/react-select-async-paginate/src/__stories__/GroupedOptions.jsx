import React, { useState } from 'react';

import AsyncPaginate, { reduceGroupedOptions } from '..';

const options = [];
for (let i = 0; i < 50; ++i) {
  options.push({
    value: i + 1,
    type: Math.ceil(Math.random() * 3),
    label: `Option ${i + 1}`,
  });
}

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const optionsPerPage = 10;

const loadOptions = async (search, page) => {
  await sleep(1000);

  let filteredOptions;
  if (!search) {
    filteredOptions = options;
  } else {
    const searchLower = search.toLowerCase();

    filteredOptions = options.filter(
      ({ label }) => label.toLowerCase().includes(searchLower),
    );
  }

  const hasMore = Math.ceil(filteredOptions.length / optionsPerPage) > page;
  const slicedOptions = filteredOptions.slice(
    (page - 1) * optionsPerPage,
    page * optionsPerPage,
  );

  const mapTypeToIndex = new Map();

  const result = [];

  slicedOptions.forEach((option) => {
    const { type } = option;

    if (mapTypeToIndex.has(type)) {
      const index = mapTypeToIndex.get(type);

      result[index].options.push(option);
    } else {
      const index = result.length;

      mapTypeToIndex.set(type, index);

      result.push({
        label: `Type #${type}`,
        options: [option],
      });
    }
  });

  return {
    options: result,
    hasMore,
  };
};

const wrapperdLoadOptions = async (q, prevOptions, { page }) => {
  const {
    options: responseOptions,
    hasMore,
  } = await loadOptions(q, page);

  return {
    options: responseOptions,
    hasMore,

    additional: {
      page: page + 1,
    },
  };
};

const defaultAdditional = {
  page: 1,
};

const Example = () => {
  const [value, onChange] = useState(null);

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <AsyncPaginate
        additional={defaultAdditional}
        value={value}
        loadOptions={wrapperdLoadOptions}
        onChange={onChange}
        reduceOptions={reduceGroupedOptions}
      />
    </div>
  );
};

export default () => <Example />;
