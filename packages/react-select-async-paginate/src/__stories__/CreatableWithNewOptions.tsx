import React, { useState, useCallback } from 'react';
import type { FC } from 'react';
import sleep from 'sleep-promise';
import Creatable from 'react-select/creatable';

import { withAsyncPaginate } from '..';
import type {
  LoadOptions,
} from '..';

const AsyncPaginateCreatable = withAsyncPaginate(Creatable);

type OptionType = {
  value: number | string;
  label: string;
};

const options: OptionType[] = [];
for (let i = 0; i < 50; ++i) {
  options.push({
    value: i + 1,
    label: `Option ${i + 1}`,
  });
}

const loadOptions: LoadOptions<OptionType> = async (search, prevOptions) => {
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

const addNewOption = async (inputValue: string): Promise<OptionType> => {
  await sleep(1000);

  const newOption = {
    label: inputValue,
    value: inputValue,
  };

  options.push(newOption);

  return newOption;
};

const increaseUniq = (uniq: number): number => uniq + 1;

const Example: FC = () => {
  const [cacheUniq, setCacheUniq] = useState(0);
  const [isAddingInProgress, setIsAddingInProgress] = useState(false);
  const [value, onChange] = useState(null);

  const onCreateOption = useCallback(async (inputValue) => {
    setIsAddingInProgress(true);

    const newOption = await addNewOption(inputValue);

    setIsAddingInProgress(false);
    setCacheUniq(increaseUniq);
    onChange(newOption);
  }, []);

  return (
    <>
      <div
        style={{
          maxWidth: 300,
        }}
      >
        <AsyncPaginateCreatable
          isDisabled={isAddingInProgress}
          value={value}
          loadOptions={loadOptions}
          onCreateOption={onCreateOption}
          onChange={onChange}
          cacheUniq={cacheUniq}
        />
      </div>

      <p>
        Current value is
        {' '}
        {JSON.stringify(value)}
      </p>
    </>
  );
};

export default Example;
