import React, { useState } from "react";
import type { ReactElement } from "react";

import type { GroupBase, MultiValue } from "react-select";

import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect, waitFor, fireEvent } from "@storybook/test";

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
};
