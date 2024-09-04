import { useState } from "react";
import type { ReactElement } from "react";

import type { GroupBase, MultiValue } from "react-select";

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

let i = 0;
export const loadOptions: LoadOptions<
  OptionType,
  GroupBase<OptionType>,
  unknown
> = async (search, prevOptions) => {
  
  console.log("Mock loadOptions called ", ++i);

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

export function Simple(props: StoryProps): ReactElement {
  const [value, onChange] = useState<
    OptionType | MultiValue<OptionType> | null
  >(null);

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <AsyncPaginate
        {...props}
        value={value}
        loadOptions={props.loadOptions}
        onChange={onChange}
      />
    </div>
  );
}
