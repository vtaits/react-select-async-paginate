import React, { useState } from 'react';
import type { FC } from 'react';
import sleep from 'sleep-promise';

import { AsyncPaginate } from '..';
import type {
  LoadOptions,
} from '..';

const options = [];
for (let i = 0; i < 50; ++i) {
  options.push({
    value: i + 1,
    label: `Option ${i + 1}`,
  });
}

const loadOptions: LoadOptions = async (search, prevOptions) => {
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

  const hasMore = filteredOptions.length > prevOptions.length + 10;
  const slicedOptions = filteredOptions.slice(
    prevOptions.length,
    prevOptions.length + 10,
  );

  return {
    options: slicedOptions,
    hasMore,
  };
};

const increase = (numberOfRequests: number): number => numberOfRequests + 1;

const Example: FC = () => {
  const [value, onChange] = useState(null);
  const [numberOfRequests, setNumberOfRequests] = useState(0);

  const wrappedLoadOptions: LoadOptions = (inputValue, prevOptions) => {
    setNumberOfRequests(increase);

    return loadOptions(inputValue, prevOptions);
  };

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <p>
        Number of requests:
        {' '}
        {numberOfRequests}
      </p>

      <AsyncPaginate
        debounceTimeout={300}
        value={value}
        loadOptions={wrappedLoadOptions}
        onChange={onChange}
      />
    </div>
  );
};

export default Example;
