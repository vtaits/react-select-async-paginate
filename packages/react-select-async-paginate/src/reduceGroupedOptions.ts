import type {
  GroupBase,
} from 'react-select';

import type {
  ReduceOptions,
} from './types';

export const checkGroup = (group: unknown): group is GroupBase<unknown> => {
  if (!group) {
    return false;
  }

  const {
    label,
    options,
  } = group as {
    label?: unknown;
    options?: unknown;
  };

  if (typeof label !== 'string' && typeof label !== 'undefined') {
    return false;
  }

  if (!Array.isArray(options)) {
    return false;
  }

  return true;
};

export const reduceGroupedOptions: ReduceOptions<unknown, GroupBase<unknown>, unknown> = (
  prevOptions,
  loadedOptions,
) => {
  const res = prevOptions.slice() as GroupBase<unknown>[];

  const mapLabelToIndex: Record<string, number> = {};
  let prevOptionsIndex = 0;
  const prevOptionsLength = prevOptions.length;

  loadedOptions.forEach((optionOrGroup) => {
    const group: GroupBase<unknown> = checkGroup(optionOrGroup)
      ? optionOrGroup
      : {
        options: [optionOrGroup],
      };

    const {
      label = '',
    } = group;

    let groupIndex = mapLabelToIndex[label];
    if (typeof groupIndex !== 'number') {
      for (;
        prevOptionsIndex < prevOptionsLength && typeof mapLabelToIndex[label] !== 'number';
        ++prevOptionsIndex
      ) {
        const prevGroup = prevOptions[prevOptionsIndex];

        if (checkGroup(prevGroup)) {
          mapLabelToIndex[prevGroup.label || ''] = prevOptionsIndex;
        }
      }

      groupIndex = mapLabelToIndex[label];
    }

    if (typeof groupIndex !== 'number') {
      mapLabelToIndex[label] = res.length;
      res.push(group);
      return;
    }

    res[groupIndex] = {
      ...res[groupIndex],
      options: res[groupIndex].options.concat(group.options),
    };
  });

  return res;
};
