import { DataSourcePlugin } from '@grafana/data';
import { RavenDBDataSource } from './datasource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { VariableQueryEditor } from './VariableQueryEditor';
import { RavenQuery, RavenDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<RavenDBDataSource, RavenQuery, RavenDataSourceOptions>(RavenDBDataSource)
  .setConfigEditor(ConfigEditor)
  .setVariableQueryEditor(VariableQueryEditor)
  .setQueryEditor(QueryEditor);
