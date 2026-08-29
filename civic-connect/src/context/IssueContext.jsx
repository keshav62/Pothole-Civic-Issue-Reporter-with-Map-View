import React, { createContext, useContext } from 'react';
import { useCivic } from './CivicContext';

const IssueContext = createContext(null);

export const IssueProvider = ({ children }) => {
  const civic = useCivic();
  return <IssueContext.Provider value={civic}>{children}</IssueContext.Provider>;
};

export const useIssues = () => {
  return useContext(IssueContext) || useCivic();
};
