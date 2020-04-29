import React, { useState } from 'react';
import type { FC } from 'react';
import sleep from 'sleep-promise';

import { AsyncPaginate, reduceGroupedOptions } from '..';
import type {
  LoadOptions,
} from '..';

type OptionType = {
  value: number | string;
  type: number;
  label: string;
};

type Additional = {
  page: number;
};

const options: OptionType[] = [];
for (let i = 0; i < 50; ++i) {
  options.push({
    value: i + 1,
    type: Math.ceil(Math.random() * 3),
    label: `Option ${i + 1}`,
  });
}

const optionsPerPage = 10;

const loadOptions = async (search: string, page: number): Promise<{
  options: {
    label: string;
    options: OptionType[];
  }[];
  hasMore: boolean;
}> => {
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

  const hasMore = Math.ceil(filteredOptions.length / optionsPerPage) > page;
  const slicedOptions = filteredOptions.slice(
    (page - 1) * optionsPerPage,
    page * optionsPerPage,
  );

  const mapTypeToIndex = new Map<number, number>();

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

const wrapperdLoadOptions: LoadOptions<OptionType, Additional> = async (
  q,
  prevOptions,
  {
    page,
  },
) => {
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
        loadOptions={wrapperdLoadOptions}
        onChange={onChange}
        reduceOptions={reduceGroupedOptions}
      />
    </div>
  );
};

export default Example;
