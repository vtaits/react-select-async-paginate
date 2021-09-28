import { useState } from 'react';
import type { FC } from 'react';
import sleep from 'sleep-promise';

import { SelectFetch } from '../src';
import type { Get } from '../src';

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

const Example: FC = () => {
  const [value, onChange] = useState<OptionType>(null);

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <SelectFetch
        url="/options/"
        queryParams={{
          limit: 10,
        }}
        value={value}
        onChange={onChange}
        get={get}
      />
    </div>
  );
};

export default Example;
