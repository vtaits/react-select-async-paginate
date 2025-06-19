import type { ChipOption } from "@vkontakte/vkui";
import type { ReactElement } from "react";
import { useState } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import sleep from "sleep-promise";
import { ChipsAsyncPaginate } from "../../../src";
import type { StoryProps } from "../types";

type InitialOptionsProps = StoryProps & {
	loadOptions?: LoadOptions<ChipOption, null>;
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

const initialOptions = options.slice(0, 10);

export function InitialOptions(props: InitialOptionsProps): ReactElement {
	const [value, onChange] = useState<ChipOption[]>([]);

	const loadOptionsHandler = props?.loadOptions || loadOptions;

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<ChipsAsyncPaginate
				{...props}
				initialOptions={initialOptions}
				value={value}
				loadOptions={loadOptionsHandler}
				onChange={onChange}
			/>
		</div>
	);
}
