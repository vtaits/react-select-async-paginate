import { within, userEvent, expect, waitFor, fireEvent } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { type Get, SelectFetch } from "../src";

import { InitialOptions, get } from "./InitialOptions";

const meta: Meta<typeof InitialOptions> = {
  title: "react-select-fetch/Initial Options",
  component: InitialOptions,
};
export default meta;
type Story = StoryObj<typeof SelectFetch>;

export const InitialOptionsTest: Story = {
  name: "Interaction",
  args: {
    get: fn(get) as Get,
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const mockGet = args.get;

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
      "Verifies the initial page is displayed without loading",
      async () => {
        await waitFor(() => {
          expect(mockGet).toHaveBeenCalledTimes(0);
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
        await waitFor(
          () => {
            const listbox = canvas.getByRole("listbox");
            fireEvent.scroll(listbox, { target: { scrollTop: 1000 } });

            expect(canvas.getByText("Option 10")).toBeVisible();
          }
        );
      }
    );

    await step("Verify the first options page successfully loads", async () => {
      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledTimes(1);
      });

      await waitFor(
        () => {
          expect(canvas.getByText("Option 10")).toBeInTheDocument();
          expect(canvas.getByText("Option 20")).toBeInTheDocument();
        },
        {
          timeout: 5000,
        }
      );
    });

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
            timeout: 12000,
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
  },
};
