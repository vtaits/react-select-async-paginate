import { userEvent } from "@vitest/browser/context";
import { unwrap } from "krustykrab";
import { expect, vi } from "vitest";
import type { RenderResult } from "vitest-browser-react";
import "@vkontakte/vkui/dist/vkui.css";
import { getElementLocatorSelectors } from "@vitest/browser/utils";

export function getInput(screen: RenderResult) {
	return screen.getByRole("textbox");
}

export function getMenu(screen: RenderResult) {
	return screen.baseElement.querySelector(".vkuiCustomScrollView__box");
}

export async function openMenu(screen: RenderResult) {
	const input = getInput(screen);

	await input.click();

	await expect.element(getMenu(screen)).toBeInTheDocument();
}

export async function closeMenu(screen: RenderResult) {
	await screen.getByLabelText("Скрыть").click();

	await vi.waitFor(() => {
		expect(getMenu(screen)).toBeFalsy();
	});
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
		screen.baseElement.querySelector(".vkuiCustomScrollView__box"),
	);

	menu.scrollTop = position;
}

export function getAllOptions(screen: RenderResult) {
	return getElementLocatorSelectors(unwrap(getMenu(screen))).getByText(
		/^Option/i,
	);
}

export function getAllGroups(screen: RenderResult) {
	return getElementLocatorSelectors(unwrap(getMenu(screen))).getByText(
		/^Type/i,
	);
}

export function getMultipleValue(screen: RenderResult) {
	return [
		...screen.baseElement.querySelectorAll(
			".vkuiChipsInputBase .vkuiChip__content",
		),
	].map((el) => el.childNodes[0].textContent);
}

export function getMenuOption(screen: RenderResult, optionLabel: string) {
	return screen.getByRole("option").getByText(optionLabel, {
		exact: true,
	});
}
