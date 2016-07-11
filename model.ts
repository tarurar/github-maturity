import * as api from './api';

export interface RepoItem extends api.SearchRepoItem {
  issues: RepoIssues;
}

export interface RepoIssues {
  open: number;
  closed: number;
}

export interface Owner {
  id: number;
  login: string;
  type: string;
  url: string;
}

export interface FirebaseRepoItemValue {
  forks_count: number;
  full_name: string;
  issues: RepoIssues;
  owner: Owner;
  size: number;
  stars: number;
  language: string;
  updateDate: Date;
  url: string;
}