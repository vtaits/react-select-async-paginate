import { fn, within, expect, waitFor } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";

import { scroll, type, click } from "../utils";

import type { Get } from "../../src";

import { ReloadOnError, get } from "./ReloadOnError";

const meta: Meta<typeof ReloadOnError> = {
  title: "react-select-fetch/Reload on Error",
  component: ReloadOnError,
};
export default meta;
type Story = StoryObj<typeof ReloadOnError>;

export const ReloadOnErrorInteraction: Story = {
  name: "Interaction",
  args: {
    get: fn(get) as Get,
    reloadOnErrorTimeout: 1000,
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const { get: mockGet, reloadOnErrorTimeout = 2000 } = args;

    const delay = {
      type: 200,
      click: 400,
    };
    const baseTimeout = 3000;
    const waitOptions = {
      timeout: baseTimeout + reloadOnErrorTimeout,
      interval: 400,
    };

    await step("Display drop-down options list", async () => {
      const select = canvas.getByRole("combobox");

      await click(select, { delay: delay.click });

      await waitFor(() => {
        expect(canvas.getByRole("listbox")).toBeVisible();
      }, waitOptions);
    });

    await step("Load the 1 page of options", async () => {
      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledTimes(1);
      }, waitOptions);

      await waitFor(() => {
        const optionPage = canvas.getAllByText(/^Option/i);
        expect(optionPage.length).toBe(10);
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
      let listbox = await canvas.findByRole("listbox");

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
