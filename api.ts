export interface SearchRepoItem {
  id: string;
  name: string;
  full_name: string;
  url: string;
  size: number;
  forks_count: number;
  stargazers_count: number;
  language: string;
  owner: Owner;
}

export interface Owner {
  id: number;
  login: string;
}

export interface SearchRepoResult {
  total_count: number;
  incomplete_results: boolean;
  items: Array<SearchRepoItem>;
}

export interface SearchIssueResult {
  total_count: number;
}