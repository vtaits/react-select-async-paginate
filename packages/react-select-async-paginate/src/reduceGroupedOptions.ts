import type { GroupBase, OptionsOrGroups } from "react-select";

export const checkGroup = (group: unknown): group is GroupBase<unknown> => {
	if (!group) {
		return false;
	}

	const { label, options } = group as {
		label?: unknown;
		options?: unknown;
	};

	if (typeof label !== "string" && typeof label !== "undefined") {
		return false;
	}

	if (!Array.isArray(options)) {
		return false;
	}

	return true;
};

export const reduceGroupedOptions = <
	OptionType,
	Group extends GroupBase<OptionType>,
>(
	prevOptions: OptionsOrGroups<OptionType, Group>,
	loadedOptions: OptionsOrGroups<OptionType, Group>,
): OptionsOrGroups<OptionType, Group> => {
	const res = prevOptions.slice();

	const mapLabelToIndex: Record<string, number> = {};
	let prevOptionsIndex = 0;
	const prevOptionsLength = prevOptions.length;

	for (const optionOrGroup of loadedOptions) {
		const group = checkGroup(optionOrGroup)
			? optionOrGroup
			: ({
					options: [optionOrGroup],
				} as unknown as Group);

		const { label = "" } = group;

		let groupIndex = mapLabelToIndex[label];
		if (typeof groupIndex !== "number") {
			for (
				;
				prevOptionsIndex < prevOptionsLength &&
				typeof mapLabelToIndex[label] !== "number";
				++prevOptionsIndex
			) {
				const prevGroup = prevOptions[prevOptionsIndex];

				if (checkGroup(prevGroup)) {
					mapLabelToIndex[prevGroup.label || ""] = prevOptionsIndex;
				}
			}

			groupIndex = mapLabelToIndex[label];
		}

		if (typeof groupIndex !== "number") {
			mapLabelToIndex[label] = res.length;
			res.push(group);
		} else {
			res[groupIndex] = {
				...res[groupIndex],
				options: [...(res[groupIndex] as Group).options, ...group.options],
			};
		}
	}

	return res;
};
