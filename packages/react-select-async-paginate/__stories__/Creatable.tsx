import { useState } from 'react';
import type { FC } from 'react';
import sleep from 'sleep-promise';
import Creatable from 'react-select/creatable';

import { withAsyncPaginate } from '../src';
import type {
  LoadOptions,
} from '../src';

const AsyncPaginateCreatable = withAsyncPaginate(Creatable);

type OptionType = {
  value: number | string;
  label: string;
};

const options = [];
for (let i = 0; i < 50; ++i) {
  options.push({
    value: i + 1,
    label: `Option ${i + 1}`,
  });
}

const loadOptions: LoadOptions<OptionType, null> = async (search, prevOptions) => {
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

const Example: FC = () => {
  const [value, onChange] = useState(null);

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <AsyncPaginateCreatable
        value={value}
        loadOptions={loadOptions}
        onChange={onChange}
      />
    </div>
  );
};

export default Example;
