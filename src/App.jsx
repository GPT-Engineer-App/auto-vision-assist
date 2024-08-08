import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Layout from './layouts/navbar';
import Routes from './Routes';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Layout />
    </ErrorBoundary>
  );
}

export default App;
