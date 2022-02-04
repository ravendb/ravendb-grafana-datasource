import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MetricFindValue,
} from '@grafana/data';
import { FetchError, frameToMetricFindValue, getBackendSrv, getTemplateSrv } from '@grafana/runtime';

import { QueryResponseDto, RavenDataSourceOptions, RavenQuery, RavenVariableQuery } from './types';
import { responseToDataFrame } from './DataFrameUtils';
import { FetchResponse } from '@grafana/runtime/services/backendSrv';

export class DataSource extends DataSourceApi<RavenQuery, RavenDataSourceOptions> {
  private readonly url?: string;
  private readonly database?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<RavenDataSourceOptions>) {
    super(instanceSettings);

    this.url = instanceSettings.url;
    this.database = instanceSettings.jsonData.database;
  }

  async metricFindQuery(query: RavenVariableQuery, optionalOptions?: any): Promise<MetricFindValue[]> {
    let refId = 'tempvar';
    if (optionalOptions && optionalOptions.variable && optionalOptions.variable.name) {
      refId = optionalOptions.variable.name;
    }

    //tODO: support for templates - range + other variables? - support for nesting variables!

    const rql = getTemplateSrv().replace(query.rawQuery, optionalOptions.scopedVars);
    const payload = {
      Query: rql,
    };

    const fetch = getBackendSrv().fetch<QueryResponseDto>({
      method: 'POST',
      url: this.url + '/databases/' + this.database + '/queries',
      data: payload,
      requestId: refId,
    });

    const response = await fetch.toPromise();
    const frames = responseToDataFrame(response.data);

    if (!frames || frames.length === 0) {
      return [];
    }

    return frameToMetricFindValue(frames[0]);
  }

  doRequest(query: RavenQuery, options: DataQueryRequest<RavenQuery>): Promise<FetchResponse<QueryResponseDto>> {
    const rql = getTemplateSrv().replace(query.queryText, options.scopedVars);
    const payload = {
      Query: rql,
    };

    const fetch = getBackendSrv().fetch<QueryResponseDto>({
      method: 'POST',
      url: this.url + '/databases/' + this.database + '/queries?addTimeSeriesNames=true&addSpatialProperties=true',
      data: payload,
    });

    return fetch.toPromise();
  }

  async query(options: DataQueryRequest<RavenQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map(async (query) => {
      const response = await this.doRequest(query, options);
      return responseToDataFrame(response.data);
    });

    const result: DataFrame[] = [];

    const allTasks = await Promise.all(promises);
    allTasks.forEach((task) => task.forEach((frame) => result.push(frame)));
    return {
      data: result,
    };
  }

  async testDatasource() {
    try {
      await getBackendSrv().datasourceRequest({
        method: 'GET',
        url: this.url + '/databases/' + this.database + '/stats',
      });

      return {
        status: 'success',
        message: 'Database Connection OK',
      };
    } catch (e) {
      return {
        status: 'error',
        message: 'Unable to connect to datasource',
        details: {
          message: this.extractConnectionFailure(e as FetchError),
        },
      };
    }
  }

  private extractConnectionFailure(e: FetchError): string {
    if (
      e.status === 500 &&
      e.data &&
      e.data.Type === 'Raven.Client.Exceptions.Database.DatabaseDoesNotExistException'
    ) {
      return "Database '" + this.database + "' doesn't exist";
    }

    if (e.status >= 400 && e.data && e.data.Message) {
      return e.data.Message;
    }

    return e.statusText || 'Unknown error';
  }
}
