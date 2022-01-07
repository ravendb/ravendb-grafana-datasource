import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  DataSourceApi,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {

  private readonly url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    this.url = instanceSettings.url;
  }

  async doRequest(query: MyQuery) {
    const result = await getBackendSrv().datasourceRequest({
      method: "GET",
      url: this.url + "/databases",
      //params: query,
    });

    return result;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map((query) =>
        this.doRequest(query).then((response) => {
          const mountPoints = response.data.Databases[0].MountPointsUsage;
          const frame = new MutableDataFrame({
            refId: query.refId,
            fields: [
              { name: "Name", type: FieldType.string },
              { name: "UsedSpace", type: FieldType.number },
            ],
          });

          mountPoints.forEach((point: any) => {
            frame.appendRow([point.Name, point.UsedSpace]);
          });

          return frame;
        })
    );

    return Promise.all(promises).then((data) => ({ data }));
  }

  async testDatasource() {
    //TODO:
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
