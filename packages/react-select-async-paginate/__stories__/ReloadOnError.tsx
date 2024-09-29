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

let requestNumber = 0;

export const loadOptions: LoadOptions<
  OptionType,
  GroupBase<OptionType>,
  unknown
> = async (search, prevOptions) => {
  await sleep(1000);

  ++requestNumber;
  if (requestNumber % 2 !== 0) {
    throw new Error("Try again");
  }

  console.log("Запрос", requestNumber);
  

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

export function ReloadOnError(props: StoryProps): ReactElement {
  const [value, onChange] = useState<
    OptionType | MultiValue<OptionType> | null
  >(null);

  const loadOptionsHandler = props?.loadOptions || loadOptions;
  const reloadOnErrorTimeout = props?.reloadOnErrorTimeout ?? 5000;

  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <AsyncPaginate
        {...props}
        value={value}
        loadOptions={loadOptionsHandler}
        onChange={onChange}
        reloadOnErrorTimeout={reloadOnErrorTimeout}
      />
    </div>
  );
}
