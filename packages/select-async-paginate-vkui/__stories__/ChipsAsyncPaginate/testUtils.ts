import { userEvent } from "@vitest/browser/context";
import { unwrap } from "krustykrab";
import { expect } from "vitest";
import type { RenderResult } from "vitest-browser-react";
import "@vkontakte/vkui/dist/vkui.css";

export function getInput(screen: RenderResult) {
	return screen.getByRole("combobox");
}

export function getMenu(screen: RenderResult) {
	return screen.getByRole("listbox").nth(1);
}

export async function openMenu(screen: RenderResult) {
	const input = getInput(screen);

	await input.click();

	await expect.element(getMenu(screen)).toBeInTheDocument();
}

export async function closeMenu(screen: RenderResult) {
	const input = getInput(screen);

	await userEvent.click(screen.baseElement);

	await expect.element(getMenu(screen)).not.toBeInTheDocument();
}

export async function type(screen: RenderResult, text: string) {
	const input = getInput(screen);
	await userEvent.click(input);
	await input.fill(text);
}

export async function clearText(screen: RenderResult) {
	type(screen, "");
}

export async function scroll(screen: RenderResult, position: number) {
	const menu = unwrap(
		getMenu(screen).query()?.querySelector(".vkuiCustomScrollView__host"),
	);

	menu.scrollTop = position;
}

export function getAllOptions(screen: RenderResult) {
	return getMenu(screen).getByText(/^Option/i);
}

export function getAllGroups(screen: RenderResult) {
	return getMenu(screen).getByText(/^Type/i);
}

export function getMultipleValue(screen: RenderResult) {
	return [
		...screen.baseElement.querySelectorAll(
			".vkuiChipsInputBase__host .vkuiChip__content",
		),
	].map((el) => el.childNodes[0].textContent);
}

export function getMenuOption(screen: RenderResult, optionLabel: string) {
	return getMenu(screen).getByText(optionLabel, {
		exact: true,
	});
}
