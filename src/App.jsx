import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Layout from './components/Layout';
import Routes from './Routes';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Layout>
        <Routes />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
