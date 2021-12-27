import { useState } from 'react';
import type {
  GroupBase,
  MultiValue,
} from 'react-select';
import sleep from 'sleep-promise';
import CreatableSelect from 'react-select/creatable';

import { withAsyncPaginate } from '../src';
import type {
  LoadOptions,
} from '../src';

import type {
  StoryProps,
} from './types';

const AsyncPaginateCreatable = withAsyncPaginate(CreatableSelect);

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

const loadOptions: LoadOptions<
OptionType,
GroupBase<OptionType>,
null
> = async (search, prevOptions) => {
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

export function Creatable(props: StoryProps) {
  const [value, onChange] = useState<OptionType | MultiValue<OptionType>>(null);

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <AsyncPaginateCreatable
        {...props}
        value={value}
        loadOptions={loadOptions}
        onChange={onChange}
      />
    </div>
  );
}
