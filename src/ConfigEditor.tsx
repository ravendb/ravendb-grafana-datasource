import React, { ChangeEvent, PureComponent } from 'react';
import { DataSourceHttpSettings, LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions } from './types';

const { FormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onDatabaseNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData: MyDataSourceOptions = {
      ...options.jsonData,
      database: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  render() {
    const { options, onOptionsChange } = this.props;
    const { jsonData } = options;

    return (
      <div>
        <h3>Database</h3>
        <div className="gf-form-group">
          <FormField
            label="Database"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onDatabaseNameChange}
            value={jsonData.database || ''}
            placeholder="Database name to use"
          />
        </div>

        <DataSourceHttpSettings
            defaultUrl="http://localhost:8080"
            dataSourceConfig={options}
            onChange={onOptionsChange}
            showAccessOptions={false}
            sigV4AuthToggleEnabled={false} />
      </div>
    );
  }
}
