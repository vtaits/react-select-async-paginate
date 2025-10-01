import { type ComponentProps, type ReactElement, useState } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import sleep from "sleep-promise";
import { CustomAsyncPaginate } from "../../../src";
import { sleepTimeout } from "../../common";
import type { StoryProps } from "../types";

type RequestByPageNumberProps = StoryProps & {
	loadOptions?: LoadOptions<OptionType, Additional>;
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

type Additional = {
	page: number;
};

const optionsPerPage = 10;

export const loadOptions = async (
	search: string,
	page: number,
): Promise<{
	options: OptionType[];
	hasMore: boolean;
}> => {
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

	const hasMore = Math.ceil(filteredOptions.length / optionsPerPage) > page;
	const slicedOptions = filteredOptions.slice(
		(page - 1) * optionsPerPage,
		page * optionsPerPage,
	);

	return {
		options: slicedOptions,
		hasMore,
	};
};

const initialAdditional = {
	page: 1,
};

export const loadPageOptions: LoadOptions<OptionType, Additional> = async (
	q,
	_prevOptions,
	additional,
) => {
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

export function RequestByPageNumber(
	props: RequestByPageNumberProps,
): ReactElement {
	const [value, onChange] =
		useState<ComponentProps<typeof CustomAsyncPaginate>["value"]>(undefined);

	const loadOptionsHandler = props?.loadOptions || loadPageOptions;

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<CustomAsyncPaginate
				{...props}
				additional={initialAdditional}
				value={value}
				loadOptions={loadOptionsHandler}
				onChange={(event) => {
					onChange(event.target.value);
				}}
			/>
		</div>
	);
}
