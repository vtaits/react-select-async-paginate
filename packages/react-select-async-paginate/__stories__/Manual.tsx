/* eslint-disable react/no-array-index-key */

import { useState, useCallback } from 'react';
import type { FC } from 'react';
import type {
  GroupBase,
  InputActionMeta,
  MultiValue,
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
  const [value, onChange] = useState<MultiValue<OptionType>>(null);
  const [inputValue, onInputChangeRaw] = useState('');
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [inputHistory, setInputHistory] = useState([]);

  const onInputChange = useCallback((
    newInputValue: string,
    {
      action,
    }: InputActionMeta,
  ): void => {
    setInputHistory((prevInputHistory) => [
      ...prevInputHistory,
      {
        inputValue: newInputValue,
        action,
      },
    ]);

    onInputChangeRaw(newInputValue);
  }, []);

  const onMenuOpen = useCallback((): void => {
    setMenuIsOpen(true);
  }, []);

  const onMenuClose = useCallback((): void => {
    setMenuIsOpen(false);
  }, []);

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <div>
        <button type="button" onClick={onMenuOpen}>
          Open menu
        </button>

        <button type="button" onClick={onMenuClose}>
          Close menu
        </button>
      </div>

      <AsyncPaginate
        isMulti
        closeMenuOnSelect={false}
        value={value}
        inputValue={inputValue}
        onInputChange={onInputChange}
        loadOptions={loadOptions}
        onChange={onChange}
        menuIsOpen={menuIsOpen}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
      />

      <h2>Input value history</h2>

      <table>
        <thead>
          <tr>
            <th>Action</th>

            <th>Value</th>
          </tr>
        </thead>

        <tbody>
          {inputHistory.map((historyItem, index) => (
            <tr key={index}>
              <td>{historyItem.action}</td>

              <td>{historyItem.inputValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Example;
