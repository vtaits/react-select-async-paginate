import React, { useState } from "react";
import type { ReactElement } from "react";

import type { GroupBase, MultiValue } from "react-select";

import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect, waitFor, fireEvent } from "@storybook/test";

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

const loadOptions: LoadOptions<
  OptionType,
  GroupBase<OptionType>,
  unknown
> = async (search, prevOptions) => {
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
        loadOptions={loadOptions}
        onChange={onChange}
      />
    </div>
  );
}

const waitForMutation = async (element: HTMLElement, callback: () => void) => {
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          callback();
          observer.disconnect();
          resolve();
        }
      }
    });

    observer.observe(element, { childList: true, subtree: true });
  });
};

export const playSimple = async ({
  canvasElement,
  step,
}: {
  canvasElement: HTMLElement;
  step: any;
}) => {
  const canvas = within(canvasElement);

  await step("Click on the Select to display the options list", async () => {
    const select = canvas.getByRole("combobox");
    await userEvent.click(select, {
      delay: 400,
    });

    await waitFor(() => {
      expect(canvas.getByRole("listbox")).toBeVisible();
    });
  });

  await step(
    "Scroll the options list to the end of first pagination page",
    async () => {
      await waitFor(() => {
        const listbox = canvas.getByRole("listbox");
        fireEvent.scroll(listbox, { target: { scrollTop: 500 } });

        expect(canvas.getByText("Option 10")).toBeVisible();
      });
    }
  );

  await step(
    "Scroll the options list to the end of second pagination page",
    async () => {
      await waitFor(
        () => {
          const listbox = canvas.getByRole("listbox");
          fireEvent.scroll(listbox, { target: { scrollTop: 500 } });

          expect(canvas.getByText("Option 20")).toBeVisible();
        },
        {
          // interval: 100,
          timeout: 4000,
        }
      );
    }
  );
};
