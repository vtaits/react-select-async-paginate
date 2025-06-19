import type { ReactElement } from "react";
import { useState } from "react";

import type { MultiValue } from "react-select";

import sleep from "sleep-promise";
import type { LoadOptions } from "../../src";
import { AsyncPaginate, reduceGroupedOptions } from "../../src";

import type { StoryProps } from "../types";

type GroupedOptionsProps = StoryProps & {
	loadOptions?: LoadOptions<OptionType, GroupType, Additional>;
};

type OptionType = {
	value: number | string;
	type: number;
	label: string;
};

type GroupType = {
	label: string;
	options: OptionType[];
};

type Additional = {
	page: number;
};

const options: OptionType[] = [];
for (let i = 0; i < 50; ++i) {
	options.push({
		value: i + 1,
		type: Math.ceil(Math.random() * 3),
		label: `Option ${i + 1}`,
	});
}

const optionsPerPage = 10;

const loadOptions = async (
	search: string,
	page: number,
): Promise<{
	options: {
		label: string;
		options: OptionType[];
	}[];
	hasMore: boolean;
}> => {
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

	const sortedOptions = filteredOptions.sort((a, b) => a.type - b.type);

	const slicedOptions = sortedOptions.slice(
		(page - 1) * optionsPerPage,
		page * optionsPerPage,
	);

	const hasMore = Math.ceil(filteredOptions.length / optionsPerPage) > page;

	const result: GroupType[] = [];

	const mapTypeToIndex = new Map<number, number>();

	for (const option of slicedOptions) {
		const { type } = option;

		const mappedIndex = mapTypeToIndex.get(type);

		if (typeof mappedIndex === "number") {
			result[mappedIndex].options.push(option);
		} else {
			const index = result.length;

			mapTypeToIndex.set(type, index);

			result.push({
				label: `Type #${type}`,
				options: [option],
			});
		}
	}

	return {
		options: result,
		hasMore,
	};
};

export const wrapperdLoadOptions: LoadOptions<
	OptionType,
	GroupType,
	Additional
> = async (q, _prevOptions, additional) => {
	if (!additional) {
		throw new Error("additional should be defined");
	}

	const { page } = additional;

	const { options: responseOptions, hasMore } = await loadOptions(q, page);

	return {
		options: responseOptions,
		hasMore,

		additional: {
			page: page + 1,
		},
	};
};

const initialAdditional = {
	page: 1,
};

export function GroupedOptions(props: GroupedOptionsProps): ReactElement {
	const [value, onChange] = useState<
		OptionType | MultiValue<OptionType> | null
	>(null);

	const loadOptionsHandler = props?.loadOptions || wrapperdLoadOptions;

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<AsyncPaginate
				{...props}
				additional={initialAdditional}
				value={value}
				loadOptions={loadOptionsHandler}
				onChange={onChange}
				reduceOptions={reduceGroupedOptions}
			/>
		</div>
	);
}
