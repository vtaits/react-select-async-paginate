import type { SelectValue } from "@vkontakte/vkui/dist/components/NativeSelect/NativeSelect";
import { useState } from "react";
import type { ReactElement } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import sleep from "sleep-promise";
import { CustomAsyncPaginate } from "../../src";
import type { StoryProps } from "../types";
import "@vkontakte/vkui/dist/vkui.css";

type AutoloadStoryProps = StoryProps & {
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

export const loadOptions: LoadOptions<OptionType, null | unknown> = async (
	search,
	prevOptions,
) => {
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

export function Autoload(props: AutoloadStoryProps): ReactElement {
	const [value, onChange] = useState<SelectValue | undefined>(undefined);

	const loadOptionsHandler = props?.loadOptions || loadOptions;

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<CustomAsyncPaginate
				{...props}
				autoload
				value={value}
				loadOptions={loadOptionsHandler}
				onChange={(_, nextValue) => {
					onChange(nextValue);
				}}
			/>
		</div>
	);
}
