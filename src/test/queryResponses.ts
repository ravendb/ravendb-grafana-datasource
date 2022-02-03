import { TimeSeriesQueryDto } from '../types';

export const inlineTimeSeriesResultNoGroup: TimeSeriesQueryDto = {
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
};

export const namedTimeSeriesResultNoGroup: TimeSeriesQueryDto = {
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
};

export const inlineTimeSeriesResultWithGroup: TimeSeriesQueryDto = {
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
};

export const namedTimeSeriesResultWithGroup: TimeSeriesQueryDto = {
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
};

export const complexTimeSeriesResult: TimeSeriesQueryDto = {
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
};
