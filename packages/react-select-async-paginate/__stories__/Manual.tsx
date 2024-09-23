/* eslint-disable react/no-array-index-key */

import React from "react";
import { useState, useCallback } from "react";
import type { ReactElement } from "react";

import type {
  GroupBase,
  InputActionMeta,
  InputAction,
  MultiValue,
} from "react-select";

import sleep from "sleep-promise";

import { AsyncPaginate } from "../src";
import type { LoadOptions } from "../src";

import type { StoryProps } from "./types";

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

export const loadOptions: LoadOptions<
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

    filteredOptions = options.filter(({ label }) =>
      label.toLowerCase().includes(searchLower)
    );
  }

  const hasMore = filteredOptions.length > prevOptions.length + 10;
  const slicedOptions = filteredOptions.slice(
    prevOptions.length,
    prevOptions.length + 10
  );

  return {
    options: slicedOptions,
    hasMore,
  };
};

type HistoryItemType = {
  action: InputAction;
  inputValue: string;
};

export function Manual(props: StoryProps): ReactElement {
  const [value, onChange] = useState<
    OptionType | MultiValue<OptionType> | null
  >(null);
  const [inputValue, onInputChangeRaw] = useState("");
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [inputHistory, setInputHistory] = useState<HistoryItemType[]>([]);

  const onInputChange = useCallback(
    (newInputValue: string, { action }: InputActionMeta): void => {
      setInputHistory((prevInputHistory) => [
        ...prevInputHistory,
        {
          inputValue: newInputValue,
          action,
        },
      ]);

      onInputChangeRaw(newInputValue);
    },
    []
  );

  const onMenuOpen = useCallback((): void => {
    setMenuIsOpen(true);
  }, []);

  const onMenuClose = useCallback((): void => {
    setMenuIsOpen(false);
  }, []);

  const loadOptionsHandler = props?.loadOptions || loadOptions;

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
        {...props}
        value={value}
        inputValue={inputValue}
        onInputChange={onInputChange}
        loadOptions={loadOptionsHandler}
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
}
