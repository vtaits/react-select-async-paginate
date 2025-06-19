import type { SelectValue } from "@vkontakte/vkui/dist/components/NativeSelect/NativeSelect";
import type { ReactElement } from "react";
import { useCallback, useState } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import sleep from "sleep-promise";
import { CustomAsyncPaginate } from "../../../src";
import type { StoryProps } from "../types";

type DebounceProps = StoryProps & {
	loadOptions?: LoadOptions<OptionType, null>;
	debounceTimeout?: number;
};

type OptionType = {
	value: number;
	label: string;
};

const options: OptionType[] = [];
for (let i = 0; i < 50; ++i) {
	options.push({
		value: i + 1,
		label: `Option ${i + 1}`,
	});
}

export const loadOptions: LoadOptions<OptionType, null> = async (
	search,
	prevOptions,
) => {
	await sleep(500);

	let filteredOptions: OptionType[];
	if (!search) {
		filteredOptions = options;
	} else {
		const searchLower = search.toLowerCase();

		filteredOptions = options.filter(({ label }) =>
			label.toLowerCase().includes(searchLower),
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

export function ClearCacheOnMenuClose(props: DebounceProps): ReactElement {
	const [value, onChange] = useState<SelectValue>(null);
	const [numberOfRequests, setNumberOfRequests] = useState(0);

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
			<CustomAsyncPaginate
				{...props}
				clearCacheOnMenuClose
				value={value}
				loadOptions={wrappedLoadOptions}
				onChange={(_, nextValue) => {
					onChange(nextValue);
				}}
			/>
		</div>
	);
}
