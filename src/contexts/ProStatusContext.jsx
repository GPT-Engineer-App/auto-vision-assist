import React, { createContext, useContext, useState } from 'react';

const ProStatusContext = createContext();

export const useProStatus = () => useContext(ProStatusContext);

export const ProStatusProvider = ({ children }) => {
  const [isPro, setIsPro] = useState(true);  // Set to true for development

  const value = {
    isPro,
    setIsPro
  };

  return (
    <ProStatusContext.Provider value={value}>
      {children}
    </ProStatusContext.Provider>
  );
};
