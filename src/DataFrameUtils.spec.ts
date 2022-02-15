import { responseToDataFrame } from './DataFrameUtils';
import {
  complexTimeSeriesResult,
  inlineTimeSeriesResultNoGroup,
  inlineTimeSeriesResultWithGroup,
  aliasedTimeSeriesResultNoGroup,
  aliasedTimeSeriesResultWithGroup,
  namedTimeSeriesResultNoGroup,
  namedTimeSeriesResultWithGroup,
  employeesQueryResult,
} from './test/queryResponses';
import {
  AliasedTimeSeriesQueryResultDto,
  TimeSeriesQueryGroupedItemResultDto,
  TimeSeriesQueryResultDto,
  TimeSeriesRawItemResultDto,
} from './types';

interface MarketingEvent {
  name: string;
  time: string;
}

describe('DataFrameUtils', function () {
  it('can convert object list to data frame', () => {
    const frames = responseToDataFrame({
      Results: employeesQueryResult(),
    });

    expect(frames).toHaveLength(1);
    const frame = frames[0];

    expect(frame.fields).toHaveLength(2);

    const nameField = frame.fields[0];
    expect(nameField.name).toEqual('name');
    expect(nameField.type).toEqual('string');
    expect(nameField.values.toArray()).toHaveLength(2);

    const ageField = frame.fields[1];
    expect(ageField.name).toEqual('age');
    expect(ageField.type).toEqual('number');
    expect(ageField.values.toArray()).toHaveLength(2);
  });

  it('can pick time column as TS', () => {
    const events: MarketingEvent[] = [
      {
        name: 'FB',
        time: '2021-11-30T00:00:00.0000000Z',
      },
      {
        name: 'LN',
        time: '2021-10-15T00:00:00.0000000Z',
      },
    ];

    const frames = responseToDataFrame({
      Results: events,
    });

    expect(frames).toHaveLength(1);

    const frame = frames[0];

    expect(frame.fields).toHaveLength(2);

    const nameField = frame.fields[0];
    expect(nameField.name).toEqual('name');
    expect(nameField.type).toEqual('string');
    expect(nameField.values.toArray()).toHaveLength(2);

    const timeField = frame.fields[1];
    expect(timeField.name).toEqual('time');
    expect(timeField.type).toEqual('time');
    expect(timeField.values.toArray()).toHaveLength(2);
  });

  it('can convert inline time series (not grouped) to data frame', () => {
    const response = inlineTimeSeriesResultNoGroup();
    const rawResults = response.Results[0].Results as TimeSeriesRawItemResultDto[];
    const frames = responseToDataFrame(response);
    expect(frames).not.toBeNull();
    expect(frames).toHaveLength(1);

    const frame = frames[0];
    expect(frame).not.toBeNull();

    expect(frame.fields).toHaveLength(2);
    const timeField = frame.fields[0];
    expect(timeField.name).toEqual('timestamp');
    expect(timeField.type).toEqual('time');
    expect(timeField.values).toHaveLength(2);
    expect(timeField.labels).toBeUndefined();

    const valueField = frame.fields[1];
    expect(valueField.name).toEqual('Value #1');
    expect(valueField.type).toEqual('number');
    expect(valueField.values).toHaveLength(2);
    expect(valueField.labels).toEqual({
      id: 'products/77-A',
    });

    const rawTimes = rawResults.map((x) => x.Timestamp);
    expect(timeField.values.toArray()).toEqual(rawTimes);

    const rawValues = rawResults.map((x) => x.Values[0]);
    expect(valueField.values.toArray()).toEqual(rawValues);
  });

  it('can convert inline time series (grouped) to data frame', () => {
    const response = inlineTimeSeriesResultWithGroup();
    const rawResults = response.Results[0].Results as TimeSeriesQueryGroupedItemResultDto[];
    const frames = responseToDataFrame(response);
    expect(frames).not.toBeNull();

    expect(frames).toHaveLength(1);

    const frame = frames[0];
    expect(frame).not.toBeNull();

    expect(frame.fields).toHaveLength(2);
    const timeField = frame.fields[0];
    expect(timeField.name).toEqual('timestamp');
    expect(timeField.type).toEqual('time');
    expect(timeField.values).toHaveLength(2);
    expect(timeField.labels).toBeUndefined();

    const valueField = frame.fields[1];
    expect(valueField.name).toEqual('Average - Value #1');
    expect(valueField.type).toEqual('number');
    expect(valueField.values).toHaveLength(2);
    expect(valueField.labels).toEqual({
      id: 'products/76-A',
      field: 'Average',
    });

    const rawTimes = rawResults.map((x) => x.From);
    expect(timeField.values.toArray()).toEqual(rawTimes);

    const rawValues = rawResults.map((x) => x.Average?.[0]);
    expect(valueField.values.toArray()).toEqual(rawValues);
  });

  it('can convert aliased time series (not grouped) to data frame', () => {
    const response = aliasedTimeSeriesResultNoGroup();
    const aliases = response.Results[0] as AliasedTimeSeriesQueryResultDto;
    const firstAlias = aliases.t1 as TimeSeriesQueryResultDto;
    const rawResults = firstAlias.Results as TimeSeriesRawItemResultDto[];
    const frames = responseToDataFrame(response);
    expect(frames).not.toBeNull();
    expect(frames).toHaveLength(1);

    const frame = frames[0];
    expect(frame).not.toBeNull();

    expect(frame.fields).toHaveLength(2);
    const timeField = frame.fields[0];
    expect(timeField.name).toEqual('timestamp');
    expect(timeField.type).toEqual('time');
    expect(timeField.values).toHaveLength(2);
    expect(timeField.labels).toBeUndefined();

    const valueField = frame.fields[1];
    expect(valueField.name).toEqual('Value #1');
    expect(valueField.type).toEqual('number');
    expect(valueField.values).toHaveLength(2);
    expect(valueField.labels).toEqual({
      alias: 't1',
      id: 'products/77-A',
    });

    const rawTimes = rawResults.map((x) => x.Timestamp);
    expect(timeField.values.toArray()).toEqual(rawTimes);

    const rawValues = rawResults.map((x) => x.Values[0]);
    expect(valueField.values.toArray()).toEqual(rawValues);
  });

  it('can convert aliased time series (grouped) to data frame', () => {
    const response = aliasedTimeSeriesResultWithGroup();
    const aliases = response.Results[0] as AliasedTimeSeriesQueryResultDto;
    const firstAlias = aliases.ts1 as TimeSeriesQueryResultDto;
    const rawResults = firstAlias.Results as TimeSeriesQueryGroupedItemResultDto[];
    const frames = responseToDataFrame(response);
    expect(frames).not.toBeNull();
    expect(frames).toHaveLength(1);

    const frame = frames[0];
    expect(frame).not.toBeNull();

    expect(frame.fields).toHaveLength(2);
    const timeField = frame.fields[0];
    expect(timeField.name).toEqual('timestamp');
    expect(timeField.type).toEqual('time');
    expect(timeField.values).toHaveLength(2);
    expect(timeField.labels).toBeUndefined();

    const valueField = frame.fields[1];
    expect(valueField.name).toEqual('Average - Value #1');
    expect(valueField.type).toEqual('number');
    expect(valueField.values).toHaveLength(2);
    expect(valueField.labels).toEqual({
      alias: 'ts1',
      field: 'Average',
      id: 'products/76-A',
    });

    const rawTimes = rawResults.map((x) => x.From);
    expect(timeField.values.toArray()).toEqual(rawTimes);

    const rawValues = rawResults.map((x) => x.Average?.[0]);
    expect(valueField.values.toArray()).toEqual(rawValues);
  });

  it('can convert complex time series to data frame', () => {
    const response = complexTimeSeriesResult();
    const frames = responseToDataFrame(response);
    expect(frames).not.toBeNull();
    expect(frames).toHaveLength(4);

    const frame1 = frames[0];
    expect(frame1).not.toBeNull();
    expect(frame1.fields).toHaveLength(2);
    expect(frame1.fields[0].name).toEqual('timestamp');
    expect(frame1.fields[0].type).toEqual('time');
    expect(frame1.fields[1].name).toEqual('Value #1');
    expect(frame1.fields[1].type).toEqual('number');
    expect(frame1.fields[1].labels).toEqual({
      id: 'products/76-A',
      alias: 't1',
    });

    const frame2 = frames[1];
    expect(frame2).not.toBeNull();
    expect(frame2.fields).toHaveLength(3);
    expect(frame2.fields[0].name).toEqual('timestamp');
    expect(frame2.fields[0].type).toEqual('time');
    expect(frame2.fields[1].name).toEqual('AVG - Value #1');
    expect(frame2.fields[1].labels).toEqual({
      id: 'products/76-A',
      field: 'AVG',
      alias: 't2',
    });
    expect(frame2.fields[2].name).toEqual('MIN - Value #1');
    expect(frame2.fields[2].type).toEqual('number');
    expect(frame2.fields[2].labels).toEqual({
      id: 'products/76-A',
      field: 'MIN',
      alias: 't2',
    });

    const frame3 = frames[2];
    expect(frame3).not.toBeNull();
    expect(frame3.fields).toHaveLength(2);
    expect(frame3.fields[0].name).toEqual('timestamp');
    expect(frame3.fields[0].type).toEqual('time');
    expect(frame3.fields[1].name).toEqual('Value #1');
    expect(frame3.fields[1].type).toEqual('number');
    expect(frame3.fields[1].labels).toEqual({
      id: 'products/44-A',
      alias: 't1',
    });

    const frame4 = frames[3];
    expect(frame4).not.toBeNull();
    expect(frame4.fields).toHaveLength(3);
    expect(frame4.fields[0].name).toEqual('timestamp');
    expect(frame4.fields[0].type).toEqual('time');
    expect(frame4.fields[1].name).toEqual('AVG - Value #1');
    expect(frame4.fields[1].labels).toEqual({
      id: 'products/44-A',
      field: 'AVG',
      alias: 't2',
    });
    expect(frame4.fields[2].name).toEqual('MIN - Value #1');
    expect(frame4.fields[2].type).toEqual('number');
    expect(frame4.fields[2].labels).toEqual({
      id: 'products/44-A',
      field: 'MIN',
      alias: 't2',
    });
  });

  it('can convert named time series (not grouped) to data frame', () => {
    const response = namedTimeSeriesResultNoGroup();
    const rawResults = response.Results[0].Results as TimeSeriesRawItemResultDto[];
    const frames = responseToDataFrame(response);
    expect(frames).not.toBeNull();
    expect(frames).toHaveLength(1);

    const frame = frames[0];
    expect(frame).not.toBeNull();

    expect(frame.fields).toHaveLength(2);
    const timeField = frame.fields[0];
    expect(timeField.name).toEqual('timestamp');
    expect(timeField.type).toEqual('time');
    expect(timeField.values).toHaveLength(2);
    expect(timeField.labels).toBeUndefined();

    const valueField = frame.fields[1];
    expect(valueField.name).toEqual('BPM');
    expect(valueField.type).toEqual('number');
    expect(valueField.values).toHaveLength(2);
    expect(valueField.labels).toEqual({
      id: 'employees/6-A',
    });

    const rawTimes = rawResults.map((x) => x.Timestamp);
    expect(timeField.values.toArray()).toEqual(rawTimes);

    const rawValues = rawResults.map((x) => x.Values[0]);
    expect(valueField.values.toArray()).toEqual(rawValues);
  });

  it('can convert named time series (grouped) to data frame', () => {
    const response = namedTimeSeriesResultWithGroup();
    const rawResults = response.Results[0].Results as TimeSeriesQueryGroupedItemResultDto[];
    const frames = responseToDataFrame(response);
    expect(frames).not.toBeNull();

    expect(frames).toHaveLength(1);

    const frame = frames[0];
    expect(frame).not.toBeNull();

    expect(frame.fields).toHaveLength(7);
    const timeField = frame.fields[0];
    expect(timeField.name).toEqual('timestamp');
    expect(timeField.type).toEqual('time');
    expect(timeField.values).toHaveLength(2);
    expect(timeField.labels).toBeUndefined();

    const valueField = frame.fields[1];
    expect(valueField.name).toEqual('First - BPM');
    expect(valueField.type).toEqual('number');
    expect(valueField.values).toHaveLength(2);
    expect(valueField.labels).toEqual({
      id: 'employees/6-A',
      field: 'First',
    });

    const rawTimes = rawResults.map((x) => x.From);
    expect(timeField.values.toArray()).toEqual(rawTimes);

    const rawValues = rawResults.map((x) => x.First?.[0]);
    expect(valueField.values.toArray()).toEqual(rawValues);
  });
});
