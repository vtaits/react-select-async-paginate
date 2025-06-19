import type { ReactElement } from "react";
import { useState } from "react";

import type { GroupBase, MultiValue } from "react-select";

import sleep from "sleep-promise";
import type { LoadOptions } from "../../src";
import { AsyncPaginate } from "../../src";

import type { StoryProps } from "../types";

type InitialOptionsProps = StoryProps & {
	loadOptions?: LoadOptions<OptionType, GroupBase<OptionType>, null>;
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

export const loadOptions: LoadOptions<
	OptionType,
	GroupBase<OptionType>,
	null
> = async (search, prevOptions) => {
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

const initialOptions = options.slice(0, 10);

export function InitialOptions(props: InitialOptionsProps): ReactElement {
	const [value, onChange] = useState<
		OptionType | MultiValue<OptionType> | null
	>(null);

	const loadOptionsHandler = props?.loadOptions || loadOptions;

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<AsyncPaginate
				{...props}
				options={initialOptions}
				value={value}
				loadOptions={loadOptionsHandler}
				onChange={onChange}
			/>
		</div>
	);
}
