import { fireEvent } from "@storybook/test";

type Canvas = {
	getByRole: (role: string, options?: { name: RegExp }) => HTMLElement;
	getByText: (
		text: string | ((content: string, element: Element | null) => boolean),
		options?: { [key: string]: unknown },
	) => HTMLElement;
	getAllByText: (text: RegExp) => HTMLElement[];
};

export async function scroll(canvas: Canvas, position: number) {
	await fireEvent.scroll(canvas.getByRole("listbox"), {
		target: { scrollTop: position },
	});
}

export function getAllOptions(canvas: Canvas) {
	return canvas.getAllByText(/^Option/i);
}

export function getAllGroups(canvas: Canvas) {
	return canvas.getAllByText(/^Type/i);
}

export function getCloseResultOption(canvas: Canvas) {
	return canvas.getByText((_, el) => {
		return el !== null && /css-.*-singleValue/.test(el.className);
	});
}

export function getCloseOpenMenuButton(canvas: Canvas) {
	return canvas.getByRole("button", { name: /Open menu/i });
}

export function getCloseCloseMenuButton(canvas: Canvas) {
	return canvas.getByRole("button", { name: /Close menu/i });
}
