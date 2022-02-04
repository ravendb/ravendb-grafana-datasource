import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface RavenQuery extends DataQuery {
  queryText?: string;
}

export const defaultQuery: Partial<RavenQuery> = {};

/**
 * These are options configured for each DataSource instance
 */
export interface RavenDataSourceOptions extends DataSourceJsonData {
  database?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface RavenSecureJsonData {}

export interface RavenVariableQuery {
  rawQuery: string;
}

export interface QueryMetadataDto {
  '@id'?: string;
  '@projection'?: boolean;
  '@timeseries-named-values'?: string[];
}

export interface QueryResponseDto<T = any> {
  TimeSeriesFields?: string[];
  Results: T[];
}

export type TimeSeriesQueryDto = QueryResponseDto<TimeSeriesQueryResultDto | AliasedTimeSeriesQueryResultDto>;

export interface AliasedTimeSeriesQueryResultDto {
  '@metadata': QueryMetadataDto;
  [key: string]: TimeSeriesQueryResultDto | QueryMetadataDto;
}

export interface TimeSeriesQueryResultDto {
  Count: number;
  '@metadata'?: QueryMetadataDto;
  Results: Array<TimeSeriesQueryGroupedItemResultDto | TimeSeriesRawItemResultDto>;
}

export interface TimeSeriesQueryGroupedItemResultDto {
  From: string;
  To: string;
  Key: string | null;
  [column: string]: number[] | string | null;
}

export interface TimeSeriesRawItemResultDto {
  Tag: string;
  Timestamp: string;
  Values: number[];
  IsRollup: boolean;
}

export type TimeSeriesResultType = 'raw' | 'grouped';
