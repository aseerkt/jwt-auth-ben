import { gql, useQuery } from '@apollo/client';
import React from 'react';

function App() {
  const { data, loading } = useQuery(gql`
    {
      hello
    }
  `);
  if (loading) return <div>Loading...</div>;
  return <div className='App'>{JSON.stringify(data)}</div>;
}

export default App;
