import React, { useState } from 'react';
import { RavenVariableQuery } from './types';

interface VariableQueryProps {
  query: RavenVariableQuery;
  onChange: (query: RavenVariableQuery, definition: string) => void;
}

export const VariableQueryEditor: React.FC<VariableQueryProps> = ({ onChange, query }) => {
  const [state, setState] = useState(query);

  const saveQuery = () => {
    onChange(state, state.queryText);
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) =>
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });

  return (
    <>
      <div className="gf-form">
        <span className="gf-form-label width-10">Query</span>
        <input
          name="queryText"
          className="gf-form-input"
          onBlur={saveQuery}
          onChange={handleChange}
          value={state.queryText}
        />
      </div>
    </>
  );
};
