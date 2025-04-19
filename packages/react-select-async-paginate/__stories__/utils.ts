import { expect, fireEvent, userEvent, within } from "@storybook/test";
import { unwrap } from "krustykrab";

export function getInput(root: HTMLElement) {
	return within(root).getByRole("combobox");
}

export function getMenu(root: HTMLElement) {
	return within(root).getByRole("listbox");
}

export async function openMenu(root: HTMLElement) {
	const input = getInput(root);

	await userEvent.click(input, { delay: 400 });

	await expect(getMenu(root)).toBeVisible();
}

export async function closeMenu(root: HTMLElement) {
	const input = getInput(root);

	await userEvent.click(unwrap(input.parentNode) as Element);

	await expect(within(root).queryByRole("listbox")).toBeFalsy();
}

export async function type(root: HTMLElement, text: string, delay = 200) {
	const select = getInput(root);
	await userEvent.type(select, text, { delay });
}

export async function clearText(root: HTMLElement) {
	const select = getInput(root);
	await userEvent.clear(select);
}

export async function scroll(root: HTMLElement, position: number) {
	await fireEvent.scroll(getMenu(root), {
		target: { scrollTop: position },
	});
}

export function getAllOptions(root: HTMLElement) {
	return within(getMenu(root)).getAllByText(/^Option/i);
}

export function getAllGroups(root: HTMLElement) {
	return within(getMenu(root)).getAllByText(/^Type/i);
}

export function getSingleValue(root: HTMLElement) {
	return unwrap(
		root.querySelector('[class*="-singleValue"]') as HTMLElement | null,
	);
}

export function getMultipleValue(root: HTMLElement) {
	return [...root.querySelectorAll('[class*="-multiValue"]')].map(
		(el) => el.childNodes[0].textContent,
	);
}

export function getMenuOption(root: HTMLElement, optionLabel: string) {
	return within(getMenu(root)).getByText(optionLabel);
}

export function calcDebounceCalls(
	debounceTime: number,
	inputLength: number,
	inputDelay: number,
) {
	if (inputLength === 0) {
		return 0;
	}

	if (inputDelay >= debounceTime) {
		return Math.ceil(inputLength / (inputDelay / debounceTime));
	}

	return 1;
}
