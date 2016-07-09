import * as api from './api';

export interface RepoItem extends api.SearchRepoItem {
  issues: RepoIssues;
}

export interface RepoIssues {
  open: number;
  closed: number;
}