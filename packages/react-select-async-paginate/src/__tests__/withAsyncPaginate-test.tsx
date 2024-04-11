import type { ReactElement } from "react";
import type { GroupBase, Options, Props as SelectProps } from "react-select";
import { createRenderer } from "react-test-renderer/shallow";
import type {
	AsyncPaginateProps,
	LoadOptions,
	UseAsyncPaginateResult,
} from "../types";
import { useAsyncPaginate } from "../useAsyncPaginate";
import { useComponents } from "../useComponents";
import { withAsyncPaginate } from "../withAsyncPaginate";

jest.mock("../useAsyncPaginate");
jest.mock("../useComponents");

const mockedUseComponents = jest.mocked(useComponents);
const mockedUseAsyncPaginate = jest.mocked(useAsyncPaginate);

beforeEach(() => {
	mockedUseComponents.mockReturnValue({});

	const asyncPaginateResult: UseAsyncPaginateResult<
		unknown,
		GroupBase<unknown>
	> = {
		handleScrolledToBottom: (): void => {},
		shouldLoadMore: (): boolean => true,
		isLoading: true,
		isFirstLoad: true,
		options: [],
		filterOption: null,
		inputValue: "",
		onInputChange: (): void => {},
		menuIsOpen: false,
		onMenuOpen: (): void => {},
		onMenuClose: (): void => {},
	};

	mockedUseAsyncPaginate.mockReturnValue(asyncPaginateResult);
});

afterEach(() => {
	jest.clearAllMocks();
});

type ExtendedSelectProps<
	OptionType,
	IsMulti extends boolean,
	Group extends GroupBase<OptionType>,
> = SelectProps<OptionType, IsMulti, Group> & {
	isFirstLoad: boolean;
};

type SelectComponentsConfig<
	OptionType,
	IsMulti extends boolean,
	Group extends GroupBase<OptionType>,
> = Partial<SelectProps<OptionType, IsMulti, Group>["components"]>;

function TestComponent(): ReactElement {
	return <div />;
}

const AsyncPagintate = withAsyncPaginate(TestComponent);

type PageObject<
	OptionType,
	IsMulti extends boolean,
	Group extends GroupBase<OptionType>,
> = {
	getSelectProps: () => ExtendedSelectProps<OptionType, IsMulti, Group>;
};

// biome-ignore lint/suspicious/noExplicitAny: suitable for any component
const defaultLoadOptions: LoadOptions<any, any, any> = () => ({
	options: [],
});

// biome-ignore lint/suspicious/noExplicitAny: suitable for any component
const defaultProps: AsyncPaginateProps<any, any, any, boolean> = {
	loadOptions: defaultLoadOptions,
};

const setup = <
	OptionType,
	IsMulti extends boolean,
	Group extends GroupBase<OptionType>,
>(
	props: Partial<AsyncPaginateProps<OptionType, Group, unknown, IsMulti>>,
): PageObject<OptionType, IsMulti, Group> => {
	const renderer = createRenderer();

	renderer.render(
		<AsyncPagintate
			{...(defaultProps as AsyncPaginateProps<
				OptionType,
				Group,
				unknown,
				IsMulti
			>)}
			{...props}
		/>,
	);

	const result = renderer.getRenderOutput();

	const getSelectProps = () =>
		result.props as ExtendedSelectProps<OptionType, IsMulti, Group>;

	return {
		getSelectProps,
	};
};

test("should provide props from parent to child", () => {
	const getOptionLabel = jest.fn();

	const page = setup({
		getOptionLabel,
	});

	const childProps = page.getSelectProps();

	expect(childProps.getOptionLabel).toBe(getOptionLabel);
});

test("should provide props from hook to child", () => {
	const options: Options<unknown> = [
		{
			value: 1,
			label: "1",
		},
	];

	const asyncPaginateResult: UseAsyncPaginateResult<
		unknown,
		GroupBase<unknown>
	> = {
		handleScrolledToBottom: (): void => {},
		shouldLoadMore: (): boolean => true,
		isLoading: true,
		isFirstLoad: true,
		filterOption: null,
		inputValue: "",
		onInputChange: (): void => {},
		menuIsOpen: false,
		onMenuOpen: (): void => {},
		onMenuClose: (): void => {},
		options,
	};

	mockedUseAsyncPaginate.mockReturnValue(asyncPaginateResult);

	const page = setup({});

	const childProps = page.getSelectProps();

	expect(childProps.isLoading).toBe(true);
	expect(childProps.isFirstLoad).toBe(true);
	expect(childProps.filterOption).toBe(null);
	expect(childProps.options).toBe(options);
	expect(childProps.inputValue).toBe("");
	expect(childProps.menuIsOpen).toBe(false);
});

test("should redefine isLoading prop", () => {
	const asyncPaginateResult: UseAsyncPaginateResult<
		unknown,
		GroupBase<unknown>
	> = {
		handleScrolledToBottom: (): void => {},
		shouldLoadMore: (): boolean => true,
		isLoading: false,
		isFirstLoad: true,
		filterOption: null,
		inputValue: "",
		onInputChange: (): void => {},
		menuIsOpen: false,
		onMenuOpen: (): void => {},
		onMenuClose: (): void => {},
		options: [],
	};

	mockedUseAsyncPaginate.mockReturnValue(asyncPaginateResult);

	const page = setup({
		isLoading: true,
	});

	const childProps = page.getSelectProps();

	expect(childProps.isLoading).toBe(true);
});

test("should redefine parent props with hook props", () => {
	type OptionType = {
		value: number;
		label: string;
	};

	const optionsProp: Options<OptionType> = [
		{
			value: 1,
			label: "1",
		},
	];

	const optionsHookResult: Options<OptionType> = [
		{
			value: 1,
			label: "1",
		},
	];

	mockedUseAsyncPaginate.mockReturnValue({
		handleScrolledToBottom: (): void => {},
		shouldLoadMore: (): boolean => true,
		isLoading: true,
		isFirstLoad: true,
		filterOption: null,
		inputValue: "",
		onInputChange: (): void => {},
		menuIsOpen: false,
		onMenuOpen: (): void => {},
		onMenuClose: (): void => {},
		options: optionsHookResult,
	});

	const page = setup({
		options: optionsProp,
	});

	const childProps = page.getSelectProps();

	expect(childProps.options).toBe(optionsHookResult);
});

test("should call hook with correct params", () => {
	const options = [
		{
			value: 1,
			label: "1",
		},
	];

	function Test() {
		return <div />;
	}

	setup({
		components: {
			Menu: Test,
		},

		selectRef: () => {},
		cacheUniqs: [1, 2, 3],
		options,
	});

	expect(mockedUseAsyncPaginate).toHaveBeenCalledTimes(1);

	const params = mockedUseAsyncPaginate.mock.calls[0][0];

	expect(params.options).toBe(options);
	expect(Object.hasOwn(params, "cacheUniqs")).toBe(false);
	expect(Object.hasOwn(params, "selectRef")).toBe(false);
});

test("should call hook with empty deps", () => {
	setup({});

	const deps = mockedUseAsyncPaginate.mock.calls[0][1];

	if (!Array.isArray(deps)) {
		throw new Error("Dependencies should be an array");
	}

	expect(deps.length).toBe(0);
});

test("should call hook with deps from cacheUniq", () => {
	const cacheUniqs = [1, 2, 3];

	setup({
		cacheUniqs,
	});

	expect(mockedUseAsyncPaginate.mock.calls[0][1]).toBe(cacheUniqs);
});

test("should call useComponents hook", () => {
	function Test() {
		return <div />;
	}

	const components: SelectComponentsConfig<
		unknown,
		boolean,
		GroupBase<unknown>
	> = {
		Menu: Test,
	};

	setup({
		components,
	});

	expect(mockedUseComponents).toHaveBeenCalledTimes(1);
	expect(mockedUseComponents).toHaveBeenCalledWith(components);
});

test("should use result of useComponents hook", () => {
	function Test() {
		return <div />;
	}

	const components: SelectComponentsConfig<
		unknown,
		boolean,
		GroupBase<unknown>
	> = {
		Menu: Test,
	};

	mockedUseComponents.mockReturnValue(components);

	const page = setup({
		components,
	});

	expect(page.getSelectProps().components).toBe(components);
});
