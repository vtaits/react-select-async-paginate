import { useState } from "react";
import type { ReactElement } from "react";

import sleep from "sleep-promise";

import type { MultiValue } from "react-select";

import { SelectFetch } from "../src";
import type { Get } from "../src";

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

export const get: Get = async (url, { search, offset, limit }) => {
  await sleep(1000);

  let filteredOptions: OptionType[];
  if (!search) {
    filteredOptions = options;
  } else {
    const searchLower = search.toLowerCase();

    filteredOptions = options.filter(({ label }) =>
      label.toLowerCase().includes(searchLower)
    );
  }

  const hasMore = filteredOptions.length > offset + limit;
  const slicedOptions = filteredOptions.slice(offset, offset + 10);

  return {
    options: slicedOptions,
    hasMore,
  };
};

export function Simple(props: StoryProps): ReactElement {
  const [value, onChange] = useState<
    OptionType | MultiValue<OptionType> | null
  >(null);

  const getHandler = props?.get || get;

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <SelectFetch
        {...props}
        url="/options/"
        queryParams={{
          limit: 10,
        }}
        value={value}
        onChange={onChange}
        get={getHandler}
      />
    </div>
  );
}
