import { fireEvent, userEvent } from "@storybook/test";

export const scroll = async (element: HTMLElement, position: number) => {
	await fireEvent.scroll(element, { target: { scrollTop: position } });
};

export const type = async (
	element: HTMLElement,
	text: string,
	delay: number,
) => {
	await userEvent.type(element, text, { delay });
};

export const click = async (
	element: HTMLElement,
	options?: Record<string, unknown>,
) => {
	if (options) {
		await userEvent.click(element, { ...options });
	} else {
		await userEvent.click(element);
	}
};
