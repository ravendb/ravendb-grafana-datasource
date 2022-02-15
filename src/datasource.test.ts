import { of, throwError } from 'rxjs';
import { RavenDBDataSource } from './datasource';
import { FetchResponse } from '@grafana/runtime/services/backendSrv';
import { employeesQueryResult, Person } from './test/queryResponses';
import { dateTime } from '@grafana/data';
import { QueryResponseDto, RavenVariableQuery } from './types';
import { FetchError } from '@grafana/runtime';

const fetchMock = jest.fn().mockReturnValue(of({ data: {}, status: 200 }));
const templateSrvMock = {
  replace: jest.fn((text) => text),
};

jest.mock('@grafana/runtime', () => ({
  ...(jest.requireActual('@grafana/runtime') as unknown as object),
  getBackendSrv: () => ({
    fetch: fetchMock,
  }),
  getTemplateSrv: () => templateSrvMock,
}));

describe('RavenDBDatasource', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const instanceSettings: any = {
    url: 'http://raven_host:8080',
    jsonData: {
      database: 'db1',
    },
  };

  describe('metric query', () => {
    const ds = new RavenDBDataSource(instanceSettings);
    const queryResult = employeesQueryResult();

    const r: Partial<FetchResponse<QueryResponseDto<Person>>> = {
      data: {
        Results: queryResult,
      },
    };

    fetchMock.mockReturnValue(of(r));

    it('can query', async () => {
      const query: RavenVariableQuery = {
        queryText: 'from Orders',
      };

      const result = await ds.metricFindQuery(query, {});

      expect(result).toHaveLength(2);
      expect(result[0].text).toEqual(queryResult[0].name);
      expect(result[1].text).toEqual(queryResult[1].name);
    });

    it('can replace time range', async () => {
      const query: RavenVariableQuery = {
        queryText: 'from Employees where Date between $timeFilter',
      };

      const options: any = {
        range: {
          from: dateTime(1644819800066),
          to: dateTime(1644819822222),
        },
      };

      await ds.metricFindQuery(query, options);

      expect(fetchMock).toBeCalledTimes(1);

      const call = fetchMock.mock.calls[0];
      expect(call).toHaveLength(1);
      const actualQuery = call[0].data.Query;
      expect(actualQuery).toEqual(
        'from Employees where Date between "2022-02-14T06:23:20.066Z" and "2022-02-14T06:23:42.222Z"'
      );
    });
  });

  describe('query', () => {
    const ds = new RavenDBDataSource(instanceSettings);
    const queryResult = employeesQueryResult();

    const r: Partial<FetchResponse<QueryResponseDto<Person>>> = {
      data: {
        Results: queryResult,
      },
    };

    fetchMock.mockReturnValue(of(r));

    it('can query', async () => {
      const options: any = {
        targets: [
          {
            queryText: 'from Employees',
          },
        ],
      };

      const result = await ds.query(options);

      const frame1 = result.data[0];
      expect(frame1).not.toBeNull();
      expect(frame1.fields).toHaveLength(2);
    });

    it('can replace time range', async () => {
      const options: any = {
        range: {
          from: dateTime(1644819800066),
          to: dateTime(1644819822222),
        },
        targets: [
          {
            queryText: 'from Employees where Date between $timeFilter',
          },
        ],
      };

      await ds.query(options);

      expect(fetchMock).toBeCalledTimes(1);

      const call = fetchMock.mock.calls[0];
      expect(call).toHaveLength(1);
      const actualQuery = call[0].data.Query;
      expect(actualQuery).toEqual(
        'from Employees where Date between "2022-02-14T06:23:20.066Z" and "2022-02-14T06:23:42.222Z"'
      );
    });
  });

  describe('testDataSource', () => {
    const ds = new RavenDBDataSource(instanceSettings);

    it('can complete happy path', async () => {
      const result = await ds.testDatasource();
      expect(result.status).toEqual('success');
    });

    it('can handle db not found', async () => {
      const fetchError = {
        data: {
          Type: 'Raven.Client.Exceptions.Database.DatabaseDoesNotExistException',
        },
        status: 500,
      } as FetchError;
      fetchMock.mockReturnValue(throwError(fetchError));

      const result = await ds.testDatasource();
      expect(result.status).toEqual('error');
      expect(result.message).toEqual('Unable to connect to datasource');
      expect(result.details!.message).toEqual("Database 'db1' doesn't exist");
    });
  });
});
