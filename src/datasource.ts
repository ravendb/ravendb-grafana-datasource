import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MetricFindValue,
} from '@grafana/data';
import { FetchError, getBackendSrv, getTemplateSrv } from '@grafana/runtime';

import { RavenDataSourceOptions, RavenQuery } from './types';
import { responseToDataFrame } from './DataFrameUtils';

export class DataSource extends DataSourceApi<RavenQuery, RavenDataSourceOptions> {
  private readonly url?: string;
  private readonly database?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<RavenDataSourceOptions>) {
    super(instanceSettings);

    this.url = instanceSettings.url;
    this.database = instanceSettings.jsonData.database;
  }

  fetchMetricNames(a: any, b: any) {
    //TODO:
    console.log('fetchMetricNames');

    return {
      data: [{ name: 'test1' }],
    };
  }

  async metricFindQuery(query: any, options?: any): Promise<MetricFindValue[]> {
    // Retrieve DataQueryResponse based on query.
    const response = await this.fetchMetricNames(query.namespace, query.rawQuery);

    // Convert query results to a MetricFindValue[]
    return response.data.map(frame => ({ text: frame.name }));
  }

  async doRequest(query: RavenQuery, options: DataQueryRequest<RavenQuery>) {
    const rql = getTemplateSrv().replace(query.queryText, options.scopedVars);
    const payload = {
      Query: rql,
    };
    return await getBackendSrv().datasourceRequest({
      method: 'POST',
      url: this.url + '/databases/' + this.database + '/queries?addTimeSeriesNames=true&addSpatialProperties=true',
      data: payload,
    });
  }

  async query(options: DataQueryRequest<RavenQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map(async query => {
      const response = await this.doRequest(query, options);
      return responseToDataFrame(response.data);
    });

    const result: DataFrame[] = [];

    const allProm = await Promise.all(promises);
    allProm.forEach(x => result.push(...x));
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
