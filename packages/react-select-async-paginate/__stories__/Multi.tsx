import { useState } from 'react';
import type { FC } from 'react';
import type {
  GroupBase,
} from 'react-select';
import sleep from 'sleep-promise';

import { AsyncPaginate } from '../src';
import type {
  LoadOptions,
} from '../src';

type OptionType = {
  value: number;
  label: string;
};

const options = [];
for (let i = 0; i < 50; ++i) {
  options.push({
    value: i + 1,
    label: `Option ${i + 1}`,
  });
}

const loadOptions: LoadOptions<
OptionType,
GroupBase<OptionType>,
null
> = async (search, prevOptions) => {
  await sleep(1000);

  let filteredOptions: OptionType[];
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
      <AsyncPaginate
        isMulti
        value={value}
        loadOptions={loadOptions}
        onChange={onChange}
      />
    </div>
  );
};

export default Example;