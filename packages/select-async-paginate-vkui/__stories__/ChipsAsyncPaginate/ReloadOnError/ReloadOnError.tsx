import type { ChipOption } from "@vkontakte/vkui";
import type { ReactElement } from "react";
import { useState } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import sleep from "sleep-promise";
import { ChipsAsyncPaginate } from "../../../src";
import type { StoryProps } from "../types";

type ReloadOnErrorProps = StoryProps & {
	loadOptions?: LoadOptions<ChipOption, unknown>;
	reloadOnErrorTimeout?: number;
};

const options: ChipOption[] = [];
for (let i = 0; i < 50; ++i) {
	options.push({
		value: i + 1,
		label: `Option ${i + 1}`,
	});
}

let requestNumber = 0;

export const loadOptions: LoadOptions<ChipOption, unknown> = async (
	search,
	prevOptions,
) => {
	await sleep(100);

	++requestNumber;
	if (requestNumber % 2 === 0) {
		throw new Error("Try again");
	}

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

export function ReloadOnError(props: ReloadOnErrorProps): ReactElement {
	const [value, onChange] = useState<ChipOption[]>([]);

	const loadOptionsHandler = props?.loadOptions || loadOptions;
	const reloadOnErrorTimeout = props?.reloadOnErrorTimeout || 5000;

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<ChipsAsyncPaginate
				{...props}
				value={value}
				loadOptions={loadOptionsHandler}
				onChange={onChange}
				reloadOnErrorTimeout={reloadOnErrorTimeout}
			/>
		</div>
	);
}
