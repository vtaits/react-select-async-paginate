import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
	getAllOptions,
	getInput,
	getMenu,
	getMenuOption,
	getSingleValue,
	openMenu,
	scroll,
	type,
} from "../testUtils";
import {
	CreatableWithNewOptions,
	loadOptions,
} from "./CreatableWithNewOptions";

describe("CreatableWithNewOptions", () => {
	test("CreatableWithNewOptions", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(
			<CreatableWithNewOptions loadOptions={loadOptionsProp} />,
		);

		const label = "New Option";

		// Type custom option label into the select
		const input = getInput(screen);

		await type(screen, label);

		await expect.element(input).toHaveValue(label);
		await expect.element(getMenu(screen)).toBeInTheDocument();

		expect(loadOptionsProp).toHaveBeenCalledTimes(1);

		// Create new custom option with custom value
		const listbox = getMenu(screen);
		const createOption = new RegExp(`^Create\\s*"${label}"$|^${label}$`, "i");
		const resultStr = `Current value is {"label":"${label}","value":"${label}"}`;

		const newOption = screen.getByText(createOption);
		await newOption.click();
		await expect.element(listbox).not.toBeInTheDocument();

		await expect
			.element(
				screen.getByText(label, {
					exact: true,
				}),
			)
			.toBeInTheDocument();

		await expect.element(screen.getByText(resultStr)).toBeInTheDocument();

		// Display drop-down options list
		await openMenu(screen);

		// Load the 1 page of options
		const firstOption = getMenuOption(screen, "Option 1");
		const lastOption = getMenuOption(screen, "Option 10");

		await expect.element(firstOption).toBeInTheDocument();
		await expect.element(lastOption).toBeInTheDocument();

		// Scrollto the new option
		await scroll(screen, 2000);

		await expect.element(getSingleValue(screen)).toHaveTextContent(label);
		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(20);
		});

		await scroll(screen, 2000);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(30);
		});

		await scroll(screen, 2000);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(40);
		});

		await scroll(screen, 2000);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(50);
		});

		await scroll(screen, 2000);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(51);
		});

		await expect.element(getMenuOption(screen, label)).toBeInTheDocument();
	});
});
