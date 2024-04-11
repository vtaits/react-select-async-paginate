import { useMemo } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { MenuList, useComponents } from "./useComponents";

vi.mock("react", async () => {
	const actual = await vi.importActual("react");

	return {
		...actual,
		useMemo: vi.fn(),
	};
});

const mockedUseMemo = vi.mocked(useMemo);

beforeEach(() => {
	mockedUseMemo.mockImplementation((callback) => callback());
});

afterEach(() => {
	vi.clearAllMocks();
});

test("should provide correct deps to useMemo", () => {
	function Test() {
		return <div />;
	}

	const components = {
		Menu: Test,
	};

	useComponents(components);

	expect(mockedUseMemo).toHaveBeenCalledTimes(1);
	expect(mockedUseMemo.mock.calls[0][1]).toEqual([components]);
});

test("should add MenuList to existing components", () => {
	function Test() {
		return <div />;
	}

	const components = {
		Menu: Test,
	};

	const result = useComponents(components);

	expect(result).toEqual({
		Menu: Test,
		MenuList,
	});
});

test("should redefine MenuList", () => {
	function Test() {
		return <div />;
	}

	const components = {
		MenuList: Test,
	};

	const result = useComponents(components);

	expect(result).toEqual({
		MenuList: Test,
	});
});
