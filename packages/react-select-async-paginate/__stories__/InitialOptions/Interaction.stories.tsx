import { fn, within, expect, waitFor } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import type { GroupBase } from "react-select";

import { scroll, type, click } from "../utils";

import { AsyncPaginate } from "../../src";
import type { LoadOptions } from "../../src";

import { InitialOptions, loadOptions } from "./InitialOptions";

const meta: Meta<typeof InitialOptions> = {
  title: "react-select-async-paginate/Initial Options",
  component: InitialOptions,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;
type MockLoadOptions = LoadOptions<unknown, GroupBase<unknown>, unknown>;

export const InitialOptionsInteraction: Story = {
  name: "Interaction",
  args: {
    loadOptions: fn(loadOptions as MockLoadOptions),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const mockLoadOptions = args.loadOptions;

    await step("Click on the Select to display the options list", async () => {
      const select = canvas.getByRole("combobox");

      await click(select, { delay: 400 });

      await waitFor(() => {
        expect(canvas.getByRole("listbox")).toBeVisible();
      });
    });

    await step("Initial page is displayed without loading", async () => {
      await waitFor(() => {
        expect(mockLoadOptions).toHaveBeenCalledTimes(0);
      });

      await waitFor(() => {
        expect(canvas.getByText("Option 1")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(canvas.getByText("Option 10")).toBeInTheDocument();
      });
    });

    await step(
      "Scroll the options list to the end of first pagination page",
      async () => {
        const targetText = "Option 10";
        const listbox = canvas.getByRole("listbox");

        await scroll(listbox, 500);

        await waitFor(() => {
          expect(canvas.getByText(targetText)).toBeVisible();
        });
      }
    );

    await step("First options page successfully loads", async () => {
      await waitFor(() => {
        expect(mockLoadOptions).toHaveBeenCalledTimes(1);
      });

      await waitFor(
        () => {
          expect(canvas.getByText("Option 11")).toBeInTheDocument();
        },
        {
          timeout: 2000,
        }
      );

      await waitFor(
        () => {
          expect(canvas.getByText("Option 20")).toBeInTheDocument();
        },
        {
          timeout: 2000,
        }
      );
    });

    await step(
      "Scroll the options list to the end of second pagination page",
      async () => {
        const listbox = canvas.getByRole("listbox");

        await scroll(listbox, 500);

        await waitFor(() => {
          expect(canvas.getByText("Option 20")).toBeVisible();
        });
      }
    );

    await step("Type into the Select", async () => {
      const targetText = "Option 40";
      const select = canvas.getByRole("combobox");
      const listbox = canvas.getByRole("listbox");

      await type(select, targetText, 100);

      await waitFor(() => {
        expect(listbox).toBeVisible();
      });

      await waitFor(() => {
        expect(select).toHaveValue(targetText);
      });
    });

    await step("Select option from the list", async () => {
      const targetText = "Option 40";
      const listbox = canvas.getByRole("listbox");

      await waitFor(async () => {
        const option = within(listbox).getByRole("option");
        await click(option);
      });

      await waitFor(async () => {
        expect(listbox).not.toBeVisible();
      });

      await waitFor(async () => {
        const option = canvas.getByText((content, el) => {
          return el !== null && /css-.*-singleValue/.test(el.className);
        });
        expect(option).toHaveTextContent(targetText);
      });
    });
  },
};
