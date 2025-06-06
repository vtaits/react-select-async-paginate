import { userEvent } from "@vitest/browser/context";
import { unwrap } from "krustykrab";
import { expect } from "vitest";
import type { RenderResult } from "vitest-browser-react";

export function getInput(screen: RenderResult) {
	return screen.getByRole("combobox");
}

export function getMenu(screen: RenderResult) {
	return screen.getByRole("listbox");
}

export async function openMenu(screen: RenderResult) {
	const input = getInput(screen);

	await input.click();

	await expect.element(getMenu(screen)).toBeInTheDocument();
}

export async function closeMenu(screen: RenderResult) {
	const input = getInput(screen);

	await userEvent.click(unwrap(input.query()?.parentNode) as Element);

	await expect.element(getMenu(screen)).not.toBeInTheDocument();
}

export async function type(screen: RenderResult, text: string) {
	const input = getInput(screen);

	await input.fill(text);
}

export async function clearText(screen: RenderResult) {
	type(screen, "");
}

export async function scroll(screen: RenderResult, position: number) {
	const menu = unwrap(getMenu(screen).query());

	menu.scrollTop = position;
}

export function getAllOptions(screen: RenderResult) {
	return getMenu(screen).getByRole("option");
}

export function getAllGroups(screen: RenderResult) {
	return getMenu(screen).getByText(/^Type/i);
}

export function getSingleValue(screen: RenderResult) {
	return unwrap(
		screen.baseElement.querySelector(
			'[class*="-singleValue"]',
		) as HTMLElement | null,
	);
}

export function getMultipleValue(screen: RenderResult) {
	return [...screen.baseElement.querySelectorAll('[class*="-multiValue"]')].map(
		(el) => el.childNodes[0].textContent,
	);
}

export function getMenuOption(screen: RenderResult, optionLabel: string) {
	return getMenu(screen).getByText(optionLabel, {
		exact: true,
	});
}
