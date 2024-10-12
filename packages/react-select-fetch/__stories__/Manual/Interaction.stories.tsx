import { fn, within, expect, waitFor } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";

import { scroll, type, click } from "../utils";

import type { Get } from "../../src";

import { Manual, get } from "./Manual";

const meta: Meta<typeof Manual> = {
  title: "react-select-fetch/Manual",
  component: Manual,
};
export default meta;
type Story = StoryObj<typeof Manual>;

export const ManualInteraction: Story = {
  name: "Interaction",
  args: {
    get: fn(get) as Get,
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const { get: mockGet } = args;

    const delay = {
      type: 200,
      click: 400,
    };
    const waitOptions = {
      timeout: 3000,
    };

    await step("Manual display drop-down options list", async () => {
      const button = canvas.getByRole("button", { name: /Open menu/i });

      await click(button);

      await waitFor(() => {
        expect(canvas.getByRole("listbox")).toBeVisible();
      });
    });

    await step("Manual close drop-down options list", async () => {
      const button = canvas.getByRole("button", { name: /Close menu/i });
      const listbox = canvas.getByRole("listbox");

      await click(button, { delay: delay.click });

      await waitFor(() => {
        expect(listbox).not.toBeVisible();
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
        expect(mockGet).toHaveBeenCalledTimes(1);
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
  },
};
