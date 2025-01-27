import { expect, fireEvent, userEvent, within } from "@storybook/test";
import { unwrap } from "krustykrab";

export function getInput(root: HTMLElement) {
	return within(root).getByRole("combobox");
}

export function getMenu(_root: HTMLElement) {
	const scrollView = unwrap(
		document.querySelector(".vkuiCustomScrollView__host"),
	);

	return scrollView as HTMLElement;
}

export async function openMenu(root: HTMLElement) {
	const input = getInput(root);

	await userEvent.click(input, { delay: 400 });

	await expect(getMenu(root)).toBeVisible();
}

export async function type(root: HTMLElement, text: string, delay = 200) {
	const select = getInput(root);
	await userEvent.type(select, text, { delay });
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
	return within(root).getByText((_, el) => {
		return el !== null && /css-.*-singleValue/.test(el.className);
	});
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
