import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Layout from './layouts/navbar';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
