import type { ReactElement } from "react";
import type { MenuListProps } from "react-select";
import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { CHECK_TIMEOUT, wrapMenuList } from "./wrapMenuList";

type OptionType = {
	value: number;
	label: string;
};

// biome-ignore lint/suspicious/noExplicitAny: only a few props are used
type TestMenuListProps = MenuListProps<OptionType, false, any>;

function GoodMenuList({ children, innerRef }: TestMenuListProps): ReactElement {
	return (
		<div data-testid="menu-list" ref={innerRef}>
			{children}
		</div>
	);
}

function NoRefMenuList({ children }: TestMenuListProps): ReactElement {
	return <div data-testid="menu-list">{children}</div>;
}

function renderMenuList(
	MenuList: (props: TestMenuListProps) => ReactElement,
): void {
	const WrappedMenuList = wrapMenuList(MenuList);

	const props = {
		selectProps: {
			handleScrolledToBottom: () => undefined,
			shouldLoadMore: () => false,
		},
	} as unknown as TestMenuListProps;

	render(<WrappedMenuList {...props}>Options</WrappedMenuList>);
}

describe("wrapMenuList", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("should warn once if the wrapped component does not forward `innerRef`", async () => {
		const consoleError = vi.spyOn(console, "error").mockReturnValue(undefined);

		renderMenuList(NoRefMenuList);

		await vi.waitFor(() => {
			expect(consoleError).toHaveBeenCalledTimes(1);
		});

		expect(consoleError.mock.calls[0][0]).toContain("innerRef");

		// the check repeats on a timer, but the warning should not
		await new Promise((resolve) => {
			setTimeout(resolve, CHECK_TIMEOUT * 3);
		});

		expect(consoleError).toHaveBeenCalledTimes(1);
	});

	test("should not warn if the wrapped component forwards `innerRef`", async () => {
		const consoleError = vi.spyOn(console, "error").mockReturnValue(undefined);

		renderMenuList(GoodMenuList);

		await new Promise((resolve) => {
			setTimeout(resolve, CHECK_TIMEOUT * 3);
		});

		expect(consoleError).not.toHaveBeenCalled();
	});
});
