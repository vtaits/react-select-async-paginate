import { useCallback, useMemo, useState } from "react";
import type { ReactElement } from "react";

import type { GroupBase, MultiValue, OptionsOrGroups } from "react-select";

import sleep from "sleep-promise";

import { AsyncPaginate } from "../../src";
import type { LoadOptions } from "../../src";

import type { StoryProps } from "../types";

type ShowSelectedOnTopStoryProps = StoryProps & {
	loadOptions?: LoadOptions<OptionType, GroupBase<OptionType>, unknown>;
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
	unknown
> = async (search, prevOptions) => {
	await sleep(1000);

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

export function ShowSelectedOnTop(
	props: ShowSelectedOnTopStoryProps,
): ReactElement {
	const [value, onChange] = useState<
		OptionType | MultiValue<OptionType> | null
	>(null);

	const loadOptionsHandler = props?.loadOptions || loadOptions;

	const mapOptionsForMenu = useCallback(
		(options: OptionsOrGroups<OptionType, GroupBase<OptionType>>) => {
			if (!value) {
				return options;
			}

			if (Array.isArray(value)) {
				if (value.length === 0) {
					return options;
				}

				const valueSet = new Set(value.map((option) => option.value));

				return [
					...value,
					...options.filter(
						(option) => !valueSet.has((option as OptionType).value),
					),
				];
			}

			return [
				value,
				...options.filter(
					(option) =>
						(option as OptionType).value !== (value as OptionType).value,
				),
			];
		},
		[value],
	);

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<AsyncPaginate
				{...props}
				value={value}
				mapOptionsForMenu={mapOptionsForMenu}
				loadOptions={loadOptionsHandler}
				onChange={onChange}
			/>
		</div>
	);
}
