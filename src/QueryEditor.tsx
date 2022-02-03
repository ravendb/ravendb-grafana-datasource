import defaults from 'lodash/defaults';

import React, { PureComponent } from 'react';
import { QueryField } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, RavenDataSourceOptions, RavenQuery } from './types';

type Props = QueryEditorProps<DataSource, RavenQuery, RavenDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  render() {
    const { onRunQuery, onChange } = this.props;
    const query = defaults(this.props.query, defaultQuery);
    const { queryText } = query;

    const onChangeQuery = (value: string) => {
      const nextQuery: RavenQuery = { ...query, queryText: value };
      onChange(nextQuery);
    };

    return (
      <div className="gf-form">
        <QueryField query={queryText} onRunQuery={onRunQuery} onChange={onChangeQuery} portalOrigin="ravendb-origin" />
      </div>
    );
  }
}
