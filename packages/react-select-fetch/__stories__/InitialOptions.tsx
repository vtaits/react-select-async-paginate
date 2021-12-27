import { useState } from 'react';
import sleep from 'sleep-promise';
import type {
  MultiValue,
} from 'react-select';

import { SelectFetch } from '../src';
import type { Get } from '../src';

import type {
  StoryProps,
} from './types';

type OptionType = {
  value: number;
  label: string;
};

const options: OptionType[] = [];
for (let i = 0; i < 50; ++i) {
  options.push({
    value: i + 1,
    label: `Option ${i + 1}`,
  });
}

const get: Get = async (url, {
  search,
  offset,
  limit,
}) => {
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

  const hasMore = filteredOptions.length > offset + limit;
  const slicedOptions = filteredOptions.slice(
    offset,
    offset + 10,
  );

  return {
    options: slicedOptions,
    hasMore,
  };
};

const defaultOptions = options.slice(0, 10);

export function InitialOptions(props: StoryProps) {
  const [value, onChange] = useState<OptionType | MultiValue<OptionType>>(null);

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <SelectFetch
        {...props}
        url="/options/"
        defaultOptions={defaultOptions}
        queryParams={{
          limit: 10,
        }}
        value={value}
        onChange={onChange}
        get={get}
      />
    </div>
  );
}
