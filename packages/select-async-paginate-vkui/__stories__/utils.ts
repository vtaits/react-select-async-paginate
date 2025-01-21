import { fireEvent } from "@storybook/test";
import { unwrap} from 'krustykrab'

type Canvas = {
	getByRole: (role: string, options?: { name: RegExp }) => HTMLElement;
	getByText: (
		text: string | ((content: string, element: Element | null) => boolean),
		options?: { [key: string]: unknown },
	) => HTMLElement;
	getAllByText: (text: RegExp) => HTMLElement[];
};

export function getScrollView(_canvasElement: HTMLElement) {
	const scrollView = unwrap(document.querySelector('.vkuiCustomScrollView__host'));

	return scrollView as HTMLElement;
}

export async function scroll(canvasElement: HTMLElement, position: number) {
	const scrollView = getScrollView(canvasElement);

	await fireEvent.scroll(scrollView, {
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
