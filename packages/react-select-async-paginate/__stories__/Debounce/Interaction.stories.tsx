import { fn, within, expect, waitFor } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import type { GroupBase } from "react-select";

import { scroll, type, click } from "../utils";

import { AsyncPaginate } from "../../src";
import type { LoadOptions } from "../../src";

import { Debounce, loadOptions } from "./Debounce";

const meta: Meta<typeof Debounce> = {
  title: "react-select-async-paginate/Debounce",
  component: Debounce,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;
type MockLoadOptions = LoadOptions<unknown, GroupBase<unknown>, unknown>;

export const DebounceInteraction: Story = {
  name: "Interaction",
  args: {
    loadOptions: fn(loadOptions as MockLoadOptions),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const { loadOptions: mockLoadOptions, debounceTimeout = 500 } = args;

    const delay = {
      type: 200,
      click: 400,
    };
    const baseTimeout = 3000;
    const waitOptions = {
      timeout: baseTimeout + debounceTimeout,
    };

    await step("Display drop-down options list", async () => {
      const select = canvas.getByRole("combobox");

      await click(select, { delay: delay.click });

      await waitFor(() => {
        expect(canvas.getByRole("listbox")).toBeVisible();
      });
    });

    await step("Load the 1 page of options", async () => {
      await waitFor(() => {
        expect(mockLoadOptions).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(canvas.getByText("Option 1")).toBeInTheDocument();
      }, waitOptions);

      await waitFor(() => {
        expect(canvas.getByText("Option 10")).toBeInTheDocument();
      }, waitOptions);
    });

    await step("Scroll and load the 2 page of options", async () => {
      const listbox = canvas.getByRole("listbox");

      await scroll(listbox, 500);

      await waitFor(() => {
        const optionPage = canvas.getAllByText(/^Option/i);
        expect(optionPage.length).toBe(20);
      }, waitOptions);
    });

    await step("Scroll and load the 3 page of options", async () => {
      const listbox = canvas.getByRole("listbox");

      await scroll(listbox, 500);

      await waitFor(() => {
        const optionPage = canvas.getAllByText(/^Option/i);
        expect(optionPage.length).toBe(30);
      }, waitOptions);
    });

    await step("Type option label into the select", async () => {
      const label = "Option 40";
      const select = canvas.getByRole("combobox");
      const listbox = canvas.getByRole("listbox");

      await type(select, label, delay.type);

      await waitFor(() => {
        expect(listbox).toBeVisible();
      });

      await waitFor(() => {
        expect(select).toHaveValue(label);
      });
    });

    await step("Select the specified option from the list", async () => {
      const label = "Option 40";
      const listbox = canvas.getByRole("listbox");

      await waitFor(async () => {
        const option = within(listbox).getByRole("option");
        await click(option);
      }, waitOptions);

      await waitFor(async () => {
        expect(listbox).not.toBeVisible();
      });

      await waitFor(async () => {
        const option = canvas.getByText((content, el) => {
          return el !== null && /css-.*-singleValue/.test(el.className);
        });
        expect(option).toHaveTextContent(label);
      });
    });

    await step(
      "Verify number of load options calls based on user input",
      async () => {
        const label = "Option 40";
        const inputLength = label.length;

        const expectedCalls = calculateCurrentCalls(
          debounceTimeout,
          inputLength,
          delay.type
        );

        function calculateCurrentCalls(
          debounceTime: number,
          inputLength: number,
          inputDelay: number
        ) {
          if (inputDelay < debounceTime) {
            return 1;
          }

          const calls = Math.ceil(inputLength * (inputDelay / debounceTime));
          return Math.min(calls, inputLength);
        }

        await waitFor(() => {
          const prevStepsCalls = 3;
          expect(mockLoadOptions).toHaveBeenCalledTimes(
            expectedCalls + prevStepsCalls
          );
        }, waitOptions);
      }
    );
  },
};
