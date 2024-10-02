import { within, userEvent, expect, waitFor, fireEvent } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import type { GroupBase } from "react-select";
import { fn } from "@storybook/test";

import { scroll, type, click } from "../utils";

import { AsyncPaginate } from "../../src";
import type { LoadOptions } from "../../src";

import { Creatable, loadOptions } from "./Creatable";

const meta: Meta<typeof Creatable> = {
  title: "react-select-async-paginate/Creatable",
  component: Creatable,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;
type MockLoadOptions = LoadOptions<unknown, GroupBase<unknown>, unknown>;

export const CreatableInteraction: Story = {
  name: "Interaction",
  args: {
    loadOptions: fn(loadOptions as MockLoadOptions),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const mockLoadOptions = args.loadOptions;

    const customOption = "New Option";

    await step("Type a custom option", async () => {
      const select = canvas.getByRole("combobox");
      await type(select, customOption, 100);
      const listbox = canvas.getByRole("listbox");

      await waitFor(() => {
        expect(listbox).toBeVisible();
      });
      
      await waitFor(() => {
        expect(select).toHaveValue(customOption);
      });
    });

    await step("Verify correct loading execution", async () => {
      await waitFor(() => {
        expect(mockLoadOptions).toHaveBeenCalledTimes(customOption.length + 1);
      });
    });

    await step("Create new custom option", async () => {
      const listbox = canvas.getByRole("listbox");

      await waitFor(async () => {
        const option = canvas.getByText(`Create "${customOption}"`);
        click(option);
      });

      await waitFor(async () => {
        expect(listbox).not.toBeVisible();
      });

      await waitFor(async () => {
        const createdOption = canvas.getByText(customOption);
        expect(createdOption).toHaveTextContent(customOption);
      });
    });

    await step("Click on the Select to display the options list", async () => {
      const select = canvas.getByRole("combobox");

      await click(select, {
        delay: 400,
      });

      await waitFor(() => {
        expect(canvas.getByRole("listbox")).toBeVisible();
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

    await step(
      "Scroll the options list to the end of second pagination page",
      async () => {
        const targetText = "Option 20";
        const listbox = canvas.getByRole("listbox");

        await scroll(listbox, 500);

        await waitFor(
          () => {
            expect(canvas.getByText(targetText)).toBeVisible();
          },
          {
            timeout: 4000,
          }
        );
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
        const option = canvas.getByText(targetText);
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
