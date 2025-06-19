import type { ReactElement } from "react";
import { useCallback, useState } from "react";
import type { GroupBase, MultiValue } from "react-select";
import type { CreatableProps } from "react-select/creatable";
import Creatable from "react-select/creatable";
import sleep from "sleep-promise";
import type {
	ComponentProps,
	LoadOptions,
	UseAsyncPaginateParams,
} from "../../src";
import { withAsyncPaginate } from "../../src";

import type { StoryProps } from "../types";

type AsyncPaginateCreatableProps<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
	IsMulti extends boolean,
> = CreatableProps<OptionType, IsMulti, Group> &
	UseAsyncPaginateParams<OptionType, Group, Additional> &
	ComponentProps<OptionType, Group, IsMulti>;

type AsyncPaginateCreatableType = <
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
	IsMulti extends boolean = false,
>(
	props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>,
) => ReactElement;

type CreatableWithNewOptionsProps = StoryProps & {
	loadOptions?: LoadOptions<OptionType, GroupBase<OptionType>, null>;
};

const AsyncPaginateCreatable = withAsyncPaginate(
	Creatable,
) as AsyncPaginateCreatableType;

type OptionType = {
	value: number | string;
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

const addNewOption = async (inputValue: string): Promise<OptionType> => {
	await sleep(500);

	const newOption = {
		label: inputValue,
		value: inputValue,
	};

	options.push(newOption);

	return newOption;
};

const increaseUniq = (uniq: number): number => uniq + 1;

export function CreatableWithNewOptions(
	props: CreatableWithNewOptionsProps,
): ReactElement {
	const [cacheUniq, setCacheUniq] = useState(0);
	const [isAddingInProgress, setIsAddingInProgress] = useState(false);
	const [value, onChange] = useState<
		OptionType | MultiValue<OptionType> | null
	>(null);

	const onCreateOption = useCallback(async (inputValue: string) => {
		setIsAddingInProgress(true);

		const newOption = await addNewOption(inputValue);

		setIsAddingInProgress(false);
		setCacheUniq(increaseUniq);
		onChange(newOption);
	}, []);

	const loadOptionsHandler = props?.loadOptions || loadOptions;

	return (
		<>
			<div
				style={{
					maxWidth: 300,
				}}
			>
				<AsyncPaginateCreatable
					{...props}
					isDisabled={isAddingInProgress}
					value={value}
					loadOptions={loadOptionsHandler}
					onCreateOption={onCreateOption}
					onChange={onChange}
					cacheUniqs={[cacheUniq]}
				/>
			</div>

			<p>Current value is {JSON.stringify(value)}</p>
		</>
	);
}
