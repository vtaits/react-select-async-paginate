import type { ReactElement } from "react";
import { useState } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import sleep from "sleep-promise";
import { CustomAsyncPaginate } from "../../../src";
import type { StoryProps } from "../types";

type SimpleStoryProps = StoryProps & {
	loadOptions?: LoadOptions<OptionType, unknown>;
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

const optionsDict = Object.groupBy(options, (option) => option.value);

export const loadOptions: LoadOptions<OptionType, unknown> = async (
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

export function ValueWithLabel(props: SimpleStoryProps): ReactElement {
	const [value, onChange] = useState<OptionType | null>(options[22]);

	const loadOptionsHandler = props?.loadOptions || loadOptions;

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<CustomAsyncPaginate
				{...props}
				valueWithLabel={value}
				loadOptions={loadOptionsHandler}
				onChange={(_event, nextValue) => {
					const nextOption = nextValue
						? optionsDict[Number(nextValue)]?.[0]
						: null;
					onChange(nextOption ?? null);
				}}
			/>
		</div>
	);
}
