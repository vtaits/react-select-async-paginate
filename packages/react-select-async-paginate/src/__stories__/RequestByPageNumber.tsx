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

type OptionType = {
  value: number;
  label: string;
};

type Additional = {
  page: number;
};

const optionsPerPage = 10;

const loadOptions = async (search: string, page: number): Promise<{
  options: OptionType[];
  hasMore: boolean;
}> => {
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

  return {
    options: slicedOptions,
    hasMore,
  };
};

const defaultAdditional = {
  page: 1,
};

const loadPageOptions: LoadOptions<OptionType, Additional> = async (q, prevOptions, { page }) => {
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

const Example: FC = () => {
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
        loadOptions={loadPageOptions}
        onChange={onChange}
      />
    </div>
  );
};

export default Example;
