import { within, userEvent, expect, waitFor, fireEvent } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import type { GroupBase } from "react-select";
import { fn } from "@storybook/test";

import { AsyncPaginate } from "../src";
import type { LoadOptions } from "../src";

import {
  CreatableWithNewOptions,
  loadOptions,
} from "./CreatableWithNewOptions";

const meta: Meta<typeof CreatableWithNewOptions> = {
  title: "react-select-async-paginate/Creatable with New Options",
  component: CreatableWithNewOptions,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;

export const CreatableTest: Story = {
  name: "Interaction",
  args: {
    loadOptions: fn(
      loadOptions as LoadOptions<unknown, GroupBase<unknown>, unknown>
    ),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const mockLoadOptions = args.loadOptions;

    const customOption = "New Option";

    await step("Type a custom option", async () => {
      const select = canvas.getByRole("combobox");

      await waitFor(
        async () => {
          await userEvent.type(select, customOption, { delay: 100 });
          const listbox = canvas.getByRole("listbox");

          expect(listbox).toBeVisible();
          expect(select).toHaveValue(customOption);
        },
        { timeout: 5000 }
      );
    });

    await step("Verify correct loading execution", async () => {
      await waitFor(() => {
        expect(mockLoadOptions).toHaveBeenCalledTimes(customOption.length + 1);
      });
    });

    await step("Create new custom option with custom value", async () => {
      await waitFor(async () => {
        const listbox = canvas.getByRole("listbox");

        const regex = new RegExp(
          `^Create\\s*"${customOption}"$|^${customOption}$`,
          "i"
        );

        const allOptions = await canvas.findAllByText(regex);
        const createdOption = allOptions[0];

        await userEvent.click(createdOption);
        expect(listbox).not.toBeVisible();
      });

      await waitFor(async () => {
        const createdOption = canvas.getByText(customOption);
        expect(createdOption).toHaveTextContent(customOption);
      });

      await waitFor(async () => {
        const createdOption = canvas.getByText(
          `Current value is {"label":"${customOption}","value":"${customOption}"}`
        );

        expect(createdOption).toHaveTextContent(customOption);
      });
    });

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
      const label = "Option";
      const value = 40;
      const target = label + " " + value;

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

      await waitFor(async () => {
        const currentOption = canvas.getByText(
          `Current value is {"value":${value},"label":"${target}"}`
        );

        expect(currentOption).toHaveTextContent(target);
      });
    });
  },
};
