/**
 * IssueContext.jsx
 *
 * Thin re-export that forwards everything from CivicContext.
 * This exists for backward-compatibility with any import that
 * references IssueContext directly.
 *
 * The canonical source of truth is CivicContext.jsx (maintained by the team).
 */
export { CivicProvider as IssueProvider, useCivic as useIssues } from './CivicContext';
export { CivicProvider, useCivic } from './CivicContext';
