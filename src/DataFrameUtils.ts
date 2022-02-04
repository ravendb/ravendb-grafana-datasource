import {
  QueryResponseDto,
  TimeSeriesQueryGroupedItemResultDto,
  TimeSeriesQueryResultDto,
  TimeSeriesRawItemResultDto,
  TimeSeriesResultType,
} from './types';
import { DataFrame, DataFrameDTO, FieldDTO, FieldType, MutableDataFrame, toDataFrame } from '@grafana/data';
import { Labels } from '@grafana/data/types/data';

export function responseToDataFrame(response: QueryResponseDto): DataFrame[] {
  if (response.TimeSeriesFields?.length === 0) {
    // inline time series
    return response.Results.map((x) => timeSeriesToDataFrame(x, x['@metadata']['@id'], undefined));
  }
  if (response.TimeSeriesFields && response.TimeSeriesFields.length > 0) {
    // time series with alias
    const timeSeriesColumns = response.TimeSeriesFields;
    const frames: DataFrame[] = [];

    response.Results.forEach((result) => {
      timeSeriesColumns.forEach((column) => {
        const ts = result[column];
        const id = result['@metadata']['@id'];
        if (ts) {
          frames.push(timeSeriesToDataFrame(ts, id, column));
        }
      });
    });

    return frames;
  }

  return [toDataFrame(response.Results)];
}

function detectTimeSeriesResultType(dto: TimeSeriesQueryResultDto): TimeSeriesResultType {
  const results = dto.Results;
  if (results.length === 0) {
    return 'raw'; //we guess but list is empty
  }

  const firstResult = results[0] as TimeSeriesQueryGroupedItemResultDto;
  return firstResult.From && firstResult.To ? 'grouped' : 'raw';
}

export function timeSeriesToDataFrame(
  data: TimeSeriesQueryResultDto,
  id: string,
  alias: string | undefined
): DataFrame {
  const resultType = detectTimeSeriesResultType(data);
  switch (resultType) {
    case 'grouped':
      return groupedTimeSeriesToDataFrame(data, id, alias);
    case 'raw':
      return rawTimeSeriesToDataFrame(data, id, alias);
    default:
      throw new Error('Unhandled result type = ' + resultType);
  }
}

function detectValuesCount(dto: TimeSeriesQueryResultDto): number {
  switch (detectTimeSeriesResultType(dto)) {
    case 'grouped':
      const groupedValues = dto.Results as TimeSeriesQueryGroupedItemResultDto[];
      const keys = detectGroupKeys(groupedValues);
      if (keys.length) {
        const firstKey = keys[0];

        return max(groupedValues, (x) => x[firstKey]?.length ?? 0) ?? 0;
      } else {
        return 0;
      }
    case 'raw':
      const rawValues = dto.Results as TimeSeriesRawItemResultDto[];
      return max(rawValues, (x) => x.Values.length) ?? 0;
  }
}

function max<T>(array: T[], accessor: (value: T) => number): number | undefined {
  if (array.length === 0) {
    return undefined;
  }
  let result = accessor(array[0]);

  for (let i = 0; i < array.length; i++) {
    const candidate = accessor(array[i]);
    if (candidate != null && candidate > result) {
      result = candidate;
    }
  }

  return result;
}

function detectGroupKeys(groupedValues: TimeSeriesQueryGroupedItemResultDto[]): string[] {
  const allKeys = Object.keys(groupedValues[0]);
  const keyWithOutRange = allKeys.filter((x) => x !== 'From' && x !== 'To' && x !== 'Key');
  // server added Count property every time, so we filter it out, unless only Count is available in result
  if (keyWithOutRange.length === 1 && keyWithOutRange[0] === 'Count') {
    return ['Count'];
  }
  return keyWithOutRange.filter((x) => x !== 'Count');
}

function getSeriesValuesNames(valuesCount: number, dto: TimeSeriesQueryResultDto) {
  const seriesValuesName = Array.from(Array(valuesCount).keys()).map((x) => 'Value #' + (x + 1));

  if (dto && dto['@metadata'] && dto['@metadata']['@timeseries-named-values']) {
    const namedValues = dto['@metadata']['@timeseries-named-values'];
    for (let i = 0; i < namedValues.length; i++) {
      seriesValuesName[i] = namedValues[i];
    }
  }

  return seriesValuesName;
}

function groupedTimeSeriesToDataFrame(
  data: TimeSeriesQueryResultDto,
  id: string,
  alias: string | undefined
): DataFrame {
  const groupedValues = data.Results as TimeSeriesQueryGroupedItemResultDto[];
  const timeValues: string[] = [];
  const timeField: FieldDTO = {
    name: 'timestamp',
    type: FieldType.time,
    values: timeValues,
  };

  const seriesPrefixNames = detectGroupKeys(groupedValues);
  const valuesCount = detectValuesCount(data);
  const seriesValuesName = getSeriesValuesNames(valuesCount, data);

  const valueFields: FieldDTO[] = [];

  seriesPrefixNames.forEach((prefix) => {
    seriesValuesName.forEach((valueName, valueIdx) => {
      const values: number[] = [];

      groupedValues.forEach((v) => {
        values.push((v as any)[prefix][valueIdx]);
      });

      const labels: Labels = {
        id,
        field: prefix,
      };

      if (alias) {
        labels.alias = alias;
      }

      const fieldDto: FieldDTO = {
        name: prefix + ' - ' + valueName,
        values,
        labels,
        type: FieldType.number,
      };

      valueFields.push(fieldDto);
    });
  });

  groupedValues.forEach((result) => {
    timeValues.push(result.From);
  });

  const dto: DataFrameDTO = {
    fields: [timeField].concat(valueFields),
  };

  return new MutableDataFrame(dto);
}

function rawTimeSeriesToDataFrame(data: TimeSeriesQueryResultDto, id: string, alias: string | undefined): DataFrame {
  const results = data.Results as TimeSeriesRawItemResultDto[];
  const timeValues: string[] = [];
  const timeField: FieldDTO = {
    name: 'timestamp',
    type: FieldType.time,
    values: timeValues,
  };

  const valuesCount = detectValuesCount(data);
  const seriesValuesName = getSeriesValuesNames(valuesCount, data);
  const allValues: number[][] = [];

  const valueFields: FieldDTO[] = Array.from(Array(valuesCount).keys()).map((idx) => {
    const values: number[] = [];
    allValues.push(values);
    const labels: Labels = {
      id,
    };

    if (alias) {
      labels.alias = alias;
    }

    return {
      name: seriesValuesName[idx],
      values,
      labels,
      type: FieldType.number,
    };
  });

  results.forEach((result) => {
    timeValues.push(result.Timestamp);
    for (let i = 0; i < valuesCount; i++) {
      allValues[i].push(result.Values[i]);
    }
  });

  const dto: DataFrameDTO = {
    fields: [timeField].concat(valueFields),
  };
  return new MutableDataFrame(dto);
}
