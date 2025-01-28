import type { ChipOption } from "@vkontakte/vkui";
import { useState } from "react";
import type { ReactElement } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import sleep from "sleep-promise";
import type { ShouldLoadMore } from "use-select-async-paginate";
import { ChipsAsyncPaginate } from "../../../src";
import type { StoryProps } from "../types";

type CustomScrollCheckProps = StoryProps & {
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
	await sleep(1000);

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

const shouldLoadMore: ShouldLoadMore = (
	scrollHeight,
	clientHeight,
	scrollTop,
) => {
	const bottomBorder = (scrollHeight - clientHeight) / 2;

	return bottomBorder < scrollTop;
};

export function CustomScrollCheck(props: CustomScrollCheckProps): ReactElement {
	const [value, onChange] = useState<ChipOption[]>([]);

	const loadOptionsHandler = props?.loadOptions || loadOptions;

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<p>New options will load when scrolling to half</p>

			<ChipsAsyncPaginate
				{...props}
				value={value}
				loadOptions={loadOptionsHandler}
				onChange={onChange}
				shouldLoadMore={shouldLoadMore}
			/>
		</div>
	);
}
