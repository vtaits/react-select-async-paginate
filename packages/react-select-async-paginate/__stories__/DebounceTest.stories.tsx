import { within, userEvent, expect, waitFor, fireEvent } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import type { GroupBase } from "react-select";
import { fn } from "@storybook/test";

import { AsyncPaginate } from "../src";
import type { LoadOptions } from "../src";

import { Debounce, loadOptions } from "./Debounce";

const meta: Meta<typeof Debounce> = {
  title: "react-select-async-paginate/Debounce",
  component: Debounce,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;

export const DebounceTest: Story = {
  name: "Interaction",
  args: {
    loadOptions: fn(
      loadOptions as LoadOptions<unknown, GroupBase<unknown>, unknown>
    ),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const mockLoadOptions = args.loadOptions;

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
      "Verify successful loading and rendering of the Options page",
      async () => {
        await waitFor(() => {
          expect(mockLoadOptions).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
          expect(canvas.getByText("Option 1")).toBeInTheDocument();
          expect(canvas.getByText("Option 10")).toBeInTheDocument();
        });
      }
    );

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
            timeout: 4000,
          }
        );
      }
    );

    await step("Type into the Select", async () => {
      const select = canvas.getByRole("combobox");
      const listbox = canvas.getByRole("listbox");

      await waitFor(
        async () => {
          await userEvent.type(select, "Option 40", { delay: 100 });

          expect(listbox).toBeVisible();
          expect(select).toHaveValue("Option 40");
        },
        { timeout: 5000 }
      );
    });

    await step("Select Option from the list", async () => {
      const target = "Option 40";

      await waitFor(async () => {
        const listbox = canvas.getByRole("listbox");
        const option = canvas.getByText(target);

        await userEvent.click(option);

        expect(listbox).not.toBeVisible();
      });

      await waitFor(async () => {
        const elements = canvas.getAllByText(target);
        const inputEl = elements.find((el) =>
          el.className.match(/.*singleValue.*/)
        );

        expect(inputEl).toHaveTextContent(target);
      });
    });

    await step("Verify currect number of requests", async () => {
      await waitFor(() => {
        expect(mockLoadOptions).toHaveBeenCalledTimes(12);
      });
    });
  },
};
