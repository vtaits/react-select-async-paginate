import { reduceGroupedOptions } from '../reduceGroupedOptions';

test('should concat options by default', () => {
  const prevOptions = [
    {
      label: 'Type #2',
      options: [
        {
          value: 1,
          type: 2,
          label: 'Option 1',
        },
        {
          value: 4,
          type: 2,
          label: 'Option 4',
        },
      ],
    },
    {
      label: 'Type #1',
      options: [
        {
          value: 2,
          type: 1,
          label: 'Option 2',
        },
        {
          value: 3,
          type: 1,
          label: 'Option 3',
        },
        {
          value: 5,
          type: 1,
          label: 'Option 5',
        },
        {
          value: 6,
          type: 1,
          label: 'Option 6',
        },
        {
          value: 10,
          type: 1,
          label: 'Option 10',
        },
      ],
    },
    {
      label: 'Type #3',
      options: [
        {
          value: 7,
          type: 3,
          label: 'Option 7',
        },
        {
          value: 8,
          type: 3,
          label: 'Option 8',
        },
        {
          value: 9,
          type: 3,
          label: 'Option 9',
        },
      ],
    },
  ];

  const nextOptions = [
    {
      label: 'Type #1',
      options: [
        {
          value: 11,
          type: 1,
          label: 'Option 11',
        },
        {
          value: 18,
          type: 1,
          label: 'Option 18',
        },
        {
          value: 20,
          type: 1,
          label: 'Option 20',
        },
      ],
    },
    {
      label: 'Type #3',
      options: [
        {
          value: 12,
          type: 3,
          label: 'Option 12',
        },
        {
          value: 14,
          type: 3,
          label: 'Option 14',
        },
        {
          value: 16,
          type: 3,
          label: 'Option 16',
        },
        {
          value: 19,
          type: 3,
          label: 'Option 19',
        },
      ],
    },
    {
      label: 'Type #2',
      options: [
        {
          value: 13,
          type: 2,
          label: 'Option 13',
        },
        {
          value: 15,
          type: 2,
          label: 'Option 15',
        },
        {
          value: 17,
          type: 2,
          label: 'Option 17',
        },
      ],
    },
    {
      label: 'Type #4',
      options: [
        {
          value: 20,
          type: 2,
          label: 'Option 20',
        },
        {
          value: 21,
          type: 2,
          label: 'Option 21',
        },
        {
          value: 22,
          type: 2,
          label: 'Option 22',
        },
      ],
    },
  ];

  const expectedOptions = [
    {
      label: 'Type #2',
      options: [
        {
          value: 1,
          type: 2,
          label: 'Option 1',
        },
        {
          value: 4,
          type: 2,
          label: 'Option 4',
        },
        {
          value: 13,
          type: 2,
          label: 'Option 13',
        },
        {
          value: 15,
          type: 2,
          label: 'Option 15',
        },
        {
          value: 17,
          type: 2,
          label: 'Option 17',
        },
      ],
    },
    {
      label: 'Type #1',
      options: [
        {
          value: 2,
          type: 1,
          label: 'Option 2',
        },
        {
          value: 3,
          type: 1,
          label: 'Option 3',
        },
        {
          value: 5,
          type: 1,
          label: 'Option 5',
        },
        {
          value: 6,
          type: 1,
          label: 'Option 6',
        },
        {
          value: 10,
          type: 1,
          label: 'Option 10',
        },
        {
          value: 11,
          type: 1,
          label: 'Option 11',
        },
        {
          value: 18,
          type: 1,
          label: 'Option 18',
        },
        {
          value: 20,
          type: 1,
          label: 'Option 20',
        },
      ],
    },
    {
      label: 'Type #3',
      options: [
        {
          value: 7,
          type: 3,
          label: 'Option 7',
        },
        {
          value: 8,
          type: 3,
          label: 'Option 8',
        },
        {
          value: 9,
          type: 3,
          label: 'Option 9',
        },
        {
          value: 12,
          type: 3,
          label: 'Option 12',
        },
        {
          value: 14,
          type: 3,
          label: 'Option 14',
        },
        {
          value: 16,
          type: 3,
          label: 'Option 16',
        },
        {
          value: 19,
          type: 3,
          label: 'Option 19',
        },
      ],
    },
    {
      label: 'Type #4',
      options: [
        {
          value: 20,
          type: 2,
          label: 'Option 20',
        },
        {
          value: 21,
          type: 2,
          label: 'Option 21',
        },
        {
          value: 22,
          type: 2,
          label: 'Option 22',
        },
      ],
    },
  ];

  expect(reduceGroupedOptions(prevOptions, nextOptions, null)).toEqual(expectedOptions);
});
