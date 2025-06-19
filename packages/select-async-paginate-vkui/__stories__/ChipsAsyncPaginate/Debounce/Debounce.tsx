import type { ChipOption } from "@vkontakte/vkui";
import type { ReactElement } from "react";
import { useCallback, useState } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import sleep from "sleep-promise";
import { ChipsAsyncPaginate } from "../../../src";
import type { StoryProps } from "../types";

type DebounceProps = StoryProps & {
	loadOptions?: LoadOptions<ChipOption, null>;
	debounceTimeout?: number;
};

const options: ChipOption[] = [];
for (let i = 0; i < 50; ++i) {
	options.push({
		value: i + 1,
		label: `Option ${i + 1}`,
	});
}

export const loadOptions: LoadOptions<ChipOption, null> = async (
	search,
	prevOptions,
) => {
	await sleep(500);

	let filteredOptions: ChipOption[];
	if (!search) {
		filteredOptions = options;
	} else {
		const searchLower = search.toLowerCase();

		filteredOptions = options.filter(({ label }) =>
			typeof label === "string"
				? label.toLowerCase().includes(searchLower)
				: false,
		);
	}

	const hasMore = filteredOptions.length > prevOptions.length + 10;
	const slicedOptions = filteredOptions.slice(
		prevOptions.length,
		prevOptions.length + 10,
	);

	return {
		options: slicedOptions,
		hasMore,
	};
};

const increase = (numberOfRequests: number): number => numberOfRequests + 1;

export function Debounce(props: DebounceProps): ReactElement {
	const [value, onChange] = useState<ChipOption[]>([]);
	const [numberOfRequests, setNumberOfRequests] = useState(0);

	const debounceTimeout = props?.debounceTimeout || 500;
	const wrappedLoadOptions = useCallback<typeof loadOptions>(
		(...args) => {
			setNumberOfRequests(increase);

			if (props?.loadOptions) {
				return props.loadOptions(...args);
			}

			return loadOptions(...args);
		},
		[props?.loadOptions],
	);

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<p>Number of requests: {numberOfRequests}</p>
			<ChipsAsyncPaginate
				{...props}
				value={value}
				loadOptions={wrappedLoadOptions}
				debounceTimeout={debounceTimeout}
				onChange={onChange}
			/>
		</div>
	);
}
