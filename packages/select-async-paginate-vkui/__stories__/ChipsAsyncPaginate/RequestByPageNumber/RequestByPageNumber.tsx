import type { ChipOption } from "@vkontakte/vkui";
import type { ReactElement } from "react";
import { useState } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import sleep from "sleep-promise";
import { ChipsAsyncPaginate } from "../../../src";
import type { StoryProps } from "../types";

type RequestByPageNumberProps = StoryProps & {
	loadOptions?: LoadOptions<ChipOption, Additional>;
};

const options: ChipOption[] = [];
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
	options: ChipOption[];
	hasMore: boolean;
}> => {
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

export const loadPageOptions: LoadOptions<ChipOption, Additional> = async (
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
	const [value, onChange] = useState<ChipOption[]>([]);

	const loadOptionsHandler = props?.loadOptions || loadPageOptions;

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<ChipsAsyncPaginate
				{...props}
				additional={initialAdditional}
				value={value}
				loadOptions={loadOptionsHandler}
				onChange={onChange}
			/>
		</div>
	);
}
