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

    const delay = {
      type: 200,
      click: 400,
    };
    const waitOptions = {
      timeout: 3000,
    };
    const label = "New Option";

    await step("Type custom option label into the select", async () => {
      const select = canvas.getByRole("combobox");

      await type(select, label, delay.type);

      await waitFor(() => {
        const listbox = canvas.getByRole("listbox");
        expect(listbox).toBeVisible();
      });

      await waitFor(() => {
        expect(select).toHaveValue(label);
      });

      await waitFor(() => {
        expect(mockLoadOptions).toHaveBeenCalledTimes(label.length + 1);
      });
    });

    await step("Create new custom option", async () => {
      const listbox = canvas.getByRole("listbox");

      await waitFor(async () => {
        const option = canvas.getByText(`Create "${label}"`);
        await click(option, { delay: delay.click });
      }, waitOptions);

      await waitFor(() => {
        expect(listbox).not.toBeVisible();
      });

      await waitFor(() => {
        const createdOption = canvas.getByText(label);
        expect(createdOption).toHaveTextContent(label);
      });
    });

    await step("Display drop-down options list", async () => {
      const select = canvas.getByRole("combobox");

      await click(select, { delay: delay.click });

      await waitFor(() => {
        expect(canvas.getByRole("listbox")).toBeVisible();
      });
    });

    await step("Load the 1 page of options", async () => {
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
        expect(optionPage.length).toBe(21); // +1 Custom
      }, waitOptions);
    });

    await step("Scroll and load the 3 page of options", async () => {
      const listbox = canvas.getByRole("listbox");

      await scroll(listbox, 500);

      await waitFor(() => {
        const optionPage = canvas.getAllByText(/^Option/i);
        expect(optionPage.length).toBe(31); // +1 Custom
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
  },
};
