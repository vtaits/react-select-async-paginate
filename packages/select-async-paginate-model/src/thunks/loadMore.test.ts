import { beforeEach, expect, test, vi } from "vitest";
import { RequestOptionsCaller } from "../types/internal";
import { loadMore } from "./loadMore";
import { requestOptions } from "./requestOptions";

vi.mock("./requestOptions");
const mockedRequestOptions = vi.mocked(requestOptions);

beforeEach(() => {
	vi.clearAllMocks();
});

const loadMoreThunkAction = loadMore();

test("should call not load options if cache is not defined for current input", () => {
	const dispatch = vi.fn();

	loadMoreThunkAction(
		dispatch,
		vi.fn().mockReturnValue({
			cache: {},
			inputValue: "test",
			menuIsOpen: false,
		}),
	);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

	expect(dispatch).toHaveBeenCalledTimes(0);
});

test("should call not load options if cache is defined for current input", () => {
	const dispatch = vi.fn();

	const requestOptionsThunkAction = vi.fn();
	mockedRequestOptions.mockReturnValue(requestOptionsThunkAction);

	loadMoreThunkAction(
		dispatch,
		vi.fn().mockReturnValue({
			cache: {
				test: {
					isFirstLoad: false,
					isLoading: false,
					hasMore: true,
					options: [],
					additional: undefined,
				},
			},
			inputValue: "test",
			menuIsOpen: false,
		}),
	);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(1);
	expect(mockedRequestOptions).toHaveBeenCalledWith(
		RequestOptionsCaller.MenuScroll,
	);

	expect(dispatch).toHaveBeenCalledTimes(1);
	expect(dispatch).toHaveBeenCalledWith(requestOptionsThunkAction);
});
