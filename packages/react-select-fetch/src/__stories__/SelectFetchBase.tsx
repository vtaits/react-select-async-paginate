/* eslint-disable react/no-array-index-key */

import React, { useState, useCallback } from 'react';
import type { FC } from 'react';
import sleep from 'sleep-promise';
import type { InputActionMeta } from 'react-select';

import { SelectFetch } from '..';
import type { Get } from '..';

const options = [];
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
  const [value, onChange] = useState(null);
  const [inputValue, onInputChangeRaw] = useState<string>('');
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
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

      <SelectFetch
        url="/options/"
        queryParams={{
          limit: 10,
        }}
        value={value}
        isMulti
        inputValue={inputValue}
        onInputChange={onInputChange}
        closeMenuOnSelect={false}
        onChange={onChange}
        menuIsOpen={menuIsOpen}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        get={get}
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
