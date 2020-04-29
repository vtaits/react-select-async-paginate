import React, { useState } from 'react';
import type { FC } from 'react';
import sleep from 'sleep-promise';

import { AsyncPaginate } from '..';
import type {
  LoadOptions,
  ShouldLoadMore,
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

const shouldLoadMore: ShouldLoadMore = (scrollHeight, clientHeight, scrollTop) => {
  const bottomBorder = (scrollHeight - clientHeight) / 2;

  return bottomBorder < scrollTop;
};

const Example: FC = () => {
  const [value, onChange] = useState(null);

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <p>New options will load when scrolling to half</p>

      <AsyncPaginate
        value={value}
        loadOptions={loadOptions}
        onChange={onChange}
        shouldLoadMore={shouldLoadMore}
      />
    </div>
  );
};

export default Example;
