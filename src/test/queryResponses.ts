import { TimeSeriesQueryDto } from '../types';

export const inlineTimeSeriesResultNoGroup: () => TimeSeriesQueryDto = () => ({
  Results: [
    {
      Count: 2,
      Results: [
        {
          Tag: 'TC:INC-i0iwJkE7vkePrTcR1e9sqQ',
          Timestamp: '2021-11-30T22:00:00.0000000Z',
          Values: [174.0],
          IsRollup: false,
        },
        {
          Tag: 'TC:INC-i0iwJkE7vkePrTcR1e9sqQ',
          Timestamp: '2021-12-01T01:30:54.0000000Z',
          Values: [79.0],
          IsRollup: false,
        },
      ],
      '@metadata': {
        '@id': 'products/77-A',
      },
    },
  ],
  TimeSeriesFields: [],
});

export const aliasedTimeSeriesResultNoGroup: () => TimeSeriesQueryDto = () => ({
  Results: [
    {
      t1: {
        Count: 2,
        Results: [
          {
            Tag: 'TC:INC-i0iwJkE7vkePrTcR1e9sqQ',
            Timestamp: '2021-11-30T22:00:00.0000000Z',
            Values: [174.0],
            IsRollup: false,
          },
          {
            Tag: 'TC:INC-i0iwJkE7vkePrTcR1e9sqQ',
            Timestamp: '2021-12-01T01:30:54.0000000Z',
            Values: [79.0],
            IsRollup: false,
          },
        ],
        '@metadata': {},
      },
      '@metadata': {
        '@id': 'products/77-A',
      },
    },
  ],
  TimeSeriesFields: ['t1'],
});

export const inlineTimeSeriesResultWithGroup: () => TimeSeriesQueryDto = () => ({
  Results: [
    {
      Count: 2,
      Results: [
        {
          From: '2021-11-30T00:00:00.0000000Z',
          To: '2021-12-01T00:00:00.0000000Z',
          Key: null,
          Count: [1.0],
          Average: [667.0],
        },
        {
          From: '2021-12-01T00:00:00.0000000Z',
          To: '2021-12-02T00:00:00.0000000Z',
          Key: null,
          Count: [7.0],
          Average: [581.8571428571429],
        },
      ],
      '@metadata': {
        '@id': 'products/76-A',
      },
    },
  ],
  TimeSeriesFields: [],
});

export const aliasedTimeSeriesResultWithGroup: () => TimeSeriesQueryDto = () => ({
  Results: [
    {
      ts1: {
        Count: 2,
        Results: [
          {
            From: '2021-11-30T00:00:00.0000000Z',
            To: '2021-12-01T00:00:00.0000000Z',
            Key: null,
            Count: [1.0],
            Average: [667.0],
          },
          {
            From: '2021-12-01T00:00:00.0000000Z',
            To: '2021-12-02T00:00:00.0000000Z',
            Key: null,
            Count: [7.0],
            Average: [581.8571428571429],
          },
        ],
        '@metadata': {},
      },
      '@metadata': {
        '@id': 'products/76-A',
      },
    },
  ],
  TimeSeriesFields: ['ts1'],
});

export const complexTimeSeriesResult: () => TimeSeriesQueryDto = () => ({
  Results: [
    {
      t1: {
        Count: 2,
        Results: [
          {
            Tag: 'TC:INC-i0iwJkE7vkePrTcR1e9sqQ',
            Timestamp: '2021-11-30T22:00:00.0000000Z',
            Values: [667.0],
            IsRollup: false,
          },
          {
            Tag: 'TC:INC-i0iwJkE7vkePrTcR1e9sqQ',
            Timestamp: '2021-12-01T01:30:54.0000000Z',
            Values: [278.0],
            IsRollup: false,
          },
        ],
        '@metadata': {},
      },
      t2: {
        Count: 2,
        Results: [
          {
            From: '2021-11-30T22:00:00.0000000Z',
            To: '2021-11-30T22:01:00.0000000Z',
            Key: null,
            Count: [1.0],
            AVG: [667.0],
            MIN: [667.0],
          },
          {
            From: '2021-12-01T01:30:00.0000000Z',
            To: '2021-12-01T01:31:00.0000000Z',
            Key: null,
            Count: [1.0],
            AVG: [278.0],
            MIN: [278.0],
          },
        ],
        '@metadata': {},
      },
      '@metadata': {
        '@id': 'products/76-A',
      },
    },
    {
      t1: {
        Count: 3,
        Results: [
          {
            Tag: 'TC:INC-i0iwJkE7vkePrTcR1e9sqQ',
            Timestamp: '2021-11-30T22:00:00.0000000Z',
            Values: [325.0],
            IsRollup: false,
          },
          {
            Tag: 'TC:INC-i0iwJkE7vkePrTcR1e9sqQ',
            Timestamp: '2021-12-01T01:30:54.0000000Z',
            Values: [45.0],
            IsRollup: false,
          },
          {
            Tag: 'TC:INC-i0iwJkE7vkePrTcR1e9sqQ',
            Timestamp: '2021-12-01T05:01:48.0000000Z',
            Values: [422.0],
            IsRollup: false,
          },
        ],
        '@metadata': {},
      },
      t2: {
        Count: 1,
        Results: [
          {
            From: '2021-11-30T22:00:00.0000000Z',
            To: '2021-11-30T22:01:00.0000000Z',
            Key: null,
            Count: [1.0],
            AVG: [325.0],
            MIN: [325.0],
          },
        ],
        '@metadata': {},
      },
      '@metadata': {
        '@projection': true,
        '@id': 'products/44-A',
      },
    },
  ],
  TimeSeriesFields: ['t1', 't2'],
});

export const namedTimeSeriesResultNoGroup: () => TimeSeriesQueryDto = () => ({
  Results: [
    {
      Count: 2,
      Results: [
        {
          Tag: 'watches/fitbit',
          Timestamp: '2020-05-17T00:00:00.0000000Z',
          Values: [70.00451313215518],
          IsRollup: false,
        },
        {
          Tag: 'watches/fitbit',
          Timestamp: '2020-05-17T00:01:00.0000000Z',
          Values: [71.07530383210411],
          IsRollup: false,
        },
      ],
      '@metadata': {
        '@timeseries-named-values': ['BPM'],
        '@id': 'employees/6-A',
      },
    },
  ],
  TimeSeriesFields: [],
});

export const namedTimeSeriesResultWithGroup: () => TimeSeriesQueryDto = () => ({
  Results: [
    {
      Count: 2,
      Results: [
        {
          From: '2020-05-17T00:00:00.0000000Z',
          To: '2020-05-17T01:00:00.0000000Z',
          Key: null,
          First: [70.00451313215518],
          Last: [68.662829244818],
          Min: [62.34419380889469],
          Max: [79.06648734191734],
          Sum: [4213.375390145637],
          Count: [60.0],
          Average: [70.22292316909395],
        },
        {
          From: '2020-05-17T01:00:00.0000000Z',
          To: '2020-05-17T02:00:00.0000000Z',
          Key: null,
          First: [66.16448135751509],
          Last: [63.30604340569398],
          Min: [60.97291537256581],
          Max: [76.15501620976953],
          Sum: [3982.0681992951168],
          Count: [60.0],
          Average: [66.36780332158528],
        },
      ],
      '@metadata': {
        '@timeseries-named-values': ['BPM'],
        '@id': 'employees/6-A',
      },
    },
  ],
  TimeSeriesFields: [],
});

export interface Person {
  name: string;
  age: number;
}

export const employeesQueryResult: () => Person[] = () => [
  {
    name: 'John',
    age: 43,
  },
  {
    name: 'Stacy',
    age: 35,
  },
];
