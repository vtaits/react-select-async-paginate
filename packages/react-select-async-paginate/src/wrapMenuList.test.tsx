import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ReactElement } from "react";
import type { GroupBase, MenuListProps } from "react-select";
import { createRenderer } from "react-test-renderer/shallow";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { defaultShouldLoadMore } from "./defaultShouldLoadMore";
import { CHECK_TIMEOUT, wrapMenuList } from "./wrapMenuList";
import type { BaseSelectProps } from "./wrapMenuList";

vi.mock("react", async () => {
	const actual = await vi.importActual("react");

	return {
		...actual,
		useEffect: vi.fn(),
		useRef: vi.fn(),
		useCallback: vi.fn(),
		useMemo: vi.fn(),
	};
});

vi.useFakeTimers();

vi.spyOn(global, "setTimeout");
vi.spyOn(global, "clearTimeout");

const mockedUseCallback = vi.mocked(useCallback);
const mockedUseMemo = vi.mocked(useMemo);
const mockedUseEffect = vi.mocked(useEffect);
const mockedUseRef = vi.mocked(useRef);
const mockedSetTimeout = vi.mocked(setTimeout);

beforeEach(() => {
	mockedUseEffect.mockReturnValue(undefined);
	mockedUseCallback.mockImplementation((callback) => callback);
	mockedUseRef.mockReturnValue({
		current: null,
	});
});

afterEach(() => {
	vi.clearAllMocks();
});

function TestComponent(): ReactElement {
	return <div />;
}

const WrappedMenuList = wrapMenuList(TestComponent);

type WrappedSelectProps = Omit<
	MenuListProps<unknown, boolean, GroupBase<unknown>>,
	"selectProps"
> & {
	selectProps: BaseSelectProps;
};

const defaultProps = {
	innerRef: () => undefined,

	selectProps: {
		handleScrolledToBottom: () => undefined,
		shouldLoadMore: defaultShouldLoadMore,
	} as unknown as MenuListProps<
		unknown,
		boolean,
		GroupBase<unknown>
	>["selectProps"],
} as unknown as WrappedSelectProps;

type PageObject = {
	getChildProps: () => Record<string, unknown>;
};

const setup = (props: Partial<WrappedSelectProps>): PageObject => {
	const renderer = createRenderer();

	renderer.render(
		<WrappedMenuList
			{...(defaultProps as unknown as MenuListProps<
				unknown,
				boolean,
				GroupBase<unknown>
			>)}
			{...(props as unknown as Partial<
				MenuListProps<unknown, boolean, GroupBase<unknown>>
			>)}
		/>,
	);

	const result = renderer.getRenderOutput();

	return {
		getChildProps: () => result.props,
	};
};

test("should provide props from parent", () => {
	const page = setup({
		maxHeight: 160,
		children: "testChildren",
	});

	const childProps = page.getChildProps();

	expect(childProps.maxHeight).toBe(160);
	expect(childProps.children).toBe("testChildren");
});

test("should not handle if ref el is falsy", () => {
	setup({});

	const shouldHandle = mockedUseCallback.mock.calls[0][0];

	expect(shouldHandle()).toBe(false);
});

test("should handle if ref el is not scrollable", () => {
	mockedUseRef
		.mockReturnValue({
			current: null,
		})
		.mockReturnValue({
			current: {
				scrollTop: 0,
				scrollHeight: 100,
				clientHeight: 100,
			},
		});

	setup({});

	const shouldHandle = mockedUseCallback.mock.calls[0][0];

	expect(shouldHandle()).toBe(true);
});

test("should call shouldLoadMore with correct arguments", () => {
	const shouldLoadMore = vi.fn();

	mockedUseRef
		.mockReturnValue({
			current: null,
		})
		.mockReturnValue({
			current: {
				scrollTop: 95,
				scrollHeight: 200,
				clientHeight: 100,
			},
		});

	setup({
		selectProps: {
			...defaultProps.selectProps,
			shouldLoadMore,
		},
	});

	const shouldHandle = mockedUseCallback.mock.calls[0][0];

	shouldHandle();

	expect(shouldLoadMore).toHaveBeenCalledTimes(1);
	expect(shouldLoadMore).toHaveBeenCalledWith(200, 100, 95);
});

test("should not handle if ref el is scrollable and shouldLoadMore returns false", () => {
	mockedUseRef
		.mockReturnValue({
			current: null,
		})
		.mockReturnValue({
			current: {
				scrollTop: 30,
				scrollHeight: 200,
				clientHeight: 100,
			},
		});

	setup({
		selectProps: {
			...defaultProps.selectProps,
			shouldLoadMore: (): boolean => false,
		},
	});

	const shouldHandle = mockedUseCallback.mock.calls[0][0];

	expect(shouldHandle()).toBe(false);
});

test("should handle if ref el is scrollable and shouldLoadMore returns true", () => {
	mockedUseRef
		.mockReturnValue({
			current: null,
		})
		.mockReturnValue({
			current: {
				scrollTop: 95,
				scrollHeight: 200,
				clientHeight: 100,
			},
		});

	setup({
		selectProps: {
			...defaultProps.selectProps,
			shouldLoadMore: (): boolean => true,
		},
	});

	const shouldHandle = mockedUseCallback.mock.calls[0][0];

	expect(shouldHandle()).toBe(true);
});

test("should not call handleScrolledToBottom if should not handle", () => {
	mockedUseCallback.mockReturnValueOnce(() => false).mockReturnValue(vi.fn());

	mockedUseRef
		.mockReturnValue({
			current: null,
		})
		.mockReturnValue({
			current: null,
		});

	const handleScrolledToBottom = vi.fn();

	setup({
		selectProps: {
			...defaultProps.selectProps,
			handleScrolledToBottom,
		},
	});

	const checkAndHandle = mockedUseCallback.mock.calls[1][0];

	checkAndHandle();

	expect(handleScrolledToBottom).toHaveBeenCalledTimes(0);
});

test("should call handleScrolledToBottom if should handle", () => {
	mockedUseCallback.mockReturnValueOnce(() => true).mockReturnValue(vi.fn());

	mockedUseRef
		.mockReturnValueOnce({
			current: null,
		})
		.mockReturnValueOnce({
			current: {
				scrollTop: 0,
				scrollHeight: 100,
				clientHeight: 100,
			},
		});

	const handleScrolledToBottom = vi.fn();

	setup({
		selectProps: {
			...defaultProps.selectProps,
			handleScrolledToBottom,
		},
	});

	const checkAndHandle = mockedUseCallback.mock.calls[1][0];

	checkAndHandle();

	expect(handleScrolledToBottom).toHaveBeenCalledTimes(1);
});

test("should work if handleScrolledToBottom is not provided", () => {
	mockedUseCallback.mockReturnValueOnce(() => true).mockReturnValue(vi.fn());

	mockedUseRef
		.mockReturnValueOnce({
			current: null,
		})
		.mockReturnValueOnce({
			current: {
				scrollTop: 0,
				scrollHeight: 100,
				clientHeight: 100,
			},
		});

	setup({});

	const checkAndHandle = mockedUseCallback.mock.calls[1][0];

	checkAndHandle();
});

test("should call checkAndLoad and start timer on mount", () => {
	const setCheckAndHandleTimeout = vi.fn();

	mockedUseMemo.mockReturnValueOnce(setCheckAndHandleTimeout);

	setup({});

	mockedUseEffect.mock.calls[0][0]();

	expect(setCheckAndHandleTimeout).toHaveBeenCalledTimes(1);
});

test("should call checkAndLoad and start on call setCheckAndHandleTimeout", () => {
	const checkAndHandle = vi.fn();
	const setCheckAndHandleTimeout = vi.fn();

	mockedUseCallback
		.mockReturnValueOnce(vi.fn())
		.mockReturnValueOnce(checkAndHandle);

	mockedUseMemo.mockReturnValueOnce(setCheckAndHandleTimeout);

	mockedSetTimeout.mockReturnValue(123 as unknown as NodeJS.Timeout);

	const timeoutRef = {
		current: null,
	};

	mockedUseRef.mockReturnValueOnce(timeoutRef).mockReturnValueOnce({
		current: null,
	});

	setup({});

	const useMemoReturn = mockedUseMemo.mock.calls[0][0]();

	if (typeof useMemoReturn !== "function") {
		throw new Error("`setCheckAndHandleTimeout` is not a function");
	}

	useMemoReturn();

	expect(checkAndHandle).toHaveBeenCalledTimes(1);
	expect(setTimeout).toHaveBeenCalledTimes(1);
	expect(setTimeout).toHaveBeenLastCalledWith(useMemoReturn, CHECK_TIMEOUT);

	expect(timeoutRef.current).toBe(123);
});

test("should stop timer on unmount", () => {
	mockedUseCallback.mockReturnValue(vi.fn());
	mockedUseMemo.mockReturnValueOnce(vi.fn());

	mockedUseRef
		.mockReturnValueOnce({
			current: 123,
		})
		.mockReturnValueOnce({
			current: null,
		});

	setup({});

	const destructor = mockedUseEffect.mock.calls[0][0]();

	if (typeof destructor !== "function") {
		throw new Error("Destructor should be a function");
	}

	destructor();

	expect(clearTimeout).toHaveBeenCalledTimes(1);
	expect(clearTimeout).toHaveBeenLastCalledWith(123);
});

test("should not call extra clearTimeout", () => {
	mockedUseCallback.mockReturnValue(vi.fn());
	mockedUseMemo.mockReturnValueOnce(vi.fn());

	mockedUseRef
		.mockReturnValueOnce({
			current: null,
		})
		.mockReturnValueOnce({
			current: null,
		});

	setup({});

	const destructor = mockedUseEffect.mock.calls[0][0]();

	if (typeof destructor !== "function") {
		throw new Error("Destructor should be a function");
	}

	destructor();

	expect(clearTimeout).toHaveBeenCalledTimes(0);
});
