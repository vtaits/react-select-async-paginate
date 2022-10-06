import {
  useState,
  useCallback,
} from 'react';
import type {
  ReactElement,
} from 'react';

import sleep from 'sleep-promise';

import Creatable from 'react-select/creatable';
import type {
  CreatableProps,
} from 'react-select/creatable';
import type {
  GroupBase,
  MultiValue,
} from 'react-select';

import type {
  ComponentProps,
} from 'react-select-async-paginate';

import { withSelectFetch } from '../src';
import type {
  Get,
  UseSelectFetchParams,
} from '../src';

import type {
  StoryProps,
} from './types';

type SelectFetchCreatableProps<
OptionType,
Group extends GroupBase<OptionType>,
IsMulti extends boolean,
> =
  & CreatableProps<OptionType, IsMulti, Group>
  & UseSelectFetchParams<OptionType, Group>
  & ComponentProps<OptionType, Group, IsMulti>;

type SelectFetchCreatableType = <
OptionType,
Group extends GroupBase<OptionType>,
IsMulti extends boolean = false,
>(props: SelectFetchCreatableProps<OptionType, Group, IsMulti>) => ReactElement;

const SelectFetchCreatable = withSelectFetch(Creatable) as SelectFetchCreatableType;

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

const get: Get = async (url, {
  search,
  offset,
  limit,
}) => {
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

export function CreatableWithNewOptions(props: StoryProps): ReactElement {
  const [cacheUniq, setCacheUniq] = useState(0);
  const [isAddingInProgress, setIsAddingInProgress] = useState(false);
  const [value, onChange] = useState<OptionType | MultiValue<OptionType> | null>(null);

  const onCreateOption = useCallback(async (inputValue: string) => {
    setIsAddingInProgress(true);

    const newOption = await addNewOption(inputValue);

    setIsAddingInProgress(false);
    setCacheUniq(increaseUniq);
    onChange(newOption);
  }, []);

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <SelectFetchCreatable
        {...props}
        isDisabled={isAddingInProgress}
        url="/options/"
        queryParams={{
          limit: 10,
        }}
        onCreateOption={onCreateOption}
        value={value}
        onChange={onChange}
        cacheUniqs={[cacheUniq]}
        get={get}
      />

      <p>
        Current value is
        {' '}
        {JSON.stringify(value)}
      </p>
    </div>
  );
}
