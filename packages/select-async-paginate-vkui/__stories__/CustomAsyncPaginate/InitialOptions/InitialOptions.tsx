import { type ComponentProps, type ReactElement, useState } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import sleep from "sleep-promise";
import { CustomAsyncPaginate } from "../../../src";
import { sleepTimeout } from "../../common";
import type { StoryProps } from "../types";

type InitialOptionsProps = StoryProps & {
	loadOptions?: LoadOptions<OptionType, null>;
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

const initialOptions = options.slice(0, 10);

export function InitialOptions(props: InitialOptionsProps): ReactElement {
	const [value, onChange] =
		useState<ComponentProps<typeof CustomAsyncPaginate>["value"]>(undefined);

	const loadOptionsHandler = props?.loadOptions || loadOptions;

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<CustomAsyncPaginate
				{...props}
				initialOptions={initialOptions}
				value={value}
				loadOptions={loadOptionsHandler}
				onChange={(event) => {
					onChange(event.target.value);
				}}
			/>
		</div>
	);
}
