import type { ReactElement } from "react";
import { useState } from "react";
import type { MultiValue } from "react-select";
import sleep from "sleep-promise";
import type { Get } from "../../src";
import { SelectFetch } from "../../src";

import type { StoryProps } from "../types";

type SimpleStoryProps = StoryProps & {
	get?: Get;
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

export async function get<Response>(
	_url: string,
	params: { [key: string]: unknown },
): Promise<Response> {
	await sleep(500);

	const search = typeof params?.search === "string" ? params.search : "";
	const offset = typeof params?.offset === "number" ? params.offset : 0;
	const limit = typeof params?.limit === "number" ? params.limit : 10;

	let filteredOptions: OptionType[];

	if (search.length === 0) {
		filteredOptions = options;
	} else {
		const searchLower = search.toLowerCase();
		filteredOptions = options.filter(({ label }) =>
			label.toLowerCase().includes(searchLower),
		);
	}

	const hasMore = filteredOptions.length > offset + limit;
	const slicedOptions = filteredOptions.slice(offset, offset + limit);

	return {
		options: slicedOptions,
		hasMore,
	} as Response;
}

export function Simple(props: SimpleStoryProps): ReactElement {
	const [value, onChange] = useState<
		OptionType | MultiValue<OptionType> | null
	>(null);

	const getHandler = props?.get || get;

	return (
		<div
			style={{
				maxWidth: 300,
			}}
		>
			<SelectFetch
				{...props}
				url="/options/"
				queryParams={{
					limit: 10,
				}}
				value={value}
				onChange={onChange}
				get={getHandler}
			/>
		</div>
	);
}
