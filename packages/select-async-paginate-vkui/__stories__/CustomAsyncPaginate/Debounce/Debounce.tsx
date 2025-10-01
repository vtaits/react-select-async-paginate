import {
	type ComponentProps,
	type ReactElement,
	useCallback,
	useState,
} from "react";
import type { LoadOptions } from "select-async-paginate-model";
import sleep from "sleep-promise";
import { CustomAsyncPaginate } from "../../../src";
import { sleepTimeout } from "../../common";
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
	await sleep(sleepTimeout);

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

export function Debounce(props: DebounceProps): ReactElement {
	const [value, onChange] =
		useState<ComponentProps<typeof CustomAsyncPaginate>["value"]>(undefined);
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
			<CustomAsyncPaginate
				{...props}
				value={value}
				loadOptions={wrappedLoadOptions}
				debounceTimeout={debounceTimeout}
				onChange={(event) => {
					onChange(event.target.value);
				}}
			/>
		</div>
	);
}
