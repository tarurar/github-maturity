import * as path from 'path';
import * as config from './config';
import * as http from 'http';
import {FirebaseRepoItemValue} from './model';

export class RequestOptionsHelper {
  private static host: string = config.get('urls:host');
  private static userAgent: string = config.get('user-agent');

  public static createSearchRepo(): http.RequestOptions {
    let repoPath = config.get('urls:search:repos');
    let repoQuery = config.get('urls:query:repos');

    return {
      host: this.host,
      port: 443,
      method: 'GET',
      path: path.normalize(['/', repoPath, '?', repoQuery].join('')),
      headers: { 'user-agent': this.userAgent }
    };
  }

  public static createSearchIssue(repoFullName: string, state: 'open' | 'closed'): http.RequestOptions {
    let issuePath = config.get('urls:search:issues');
    let issueQuery = `q=state:${state}+repo:${repoFullName}+type:issue&per_page=1`;

    return {
      host: this.host,
      port: 443,
      method: 'GET',
      path: path.normalize(['/', issuePath, '?', issueQuery].join('')),
      headers: { 'user-agent': this.userAgent }
    };
  }
}

export class Convert {
  public static RepositoriesInfoToGoogleChart(repoList: Array<FirebaseRepoItemValue>): Array<Array<string | number>> {

    var results = [['ID', 'Forks', 'Stars', 'Language', 'Size']];
    repoList.forEach((value) => {
      let newVal = [];
      newVal.push(value.full_name);
      newVal.push(value.forks_count);
      newVal.push(value.stars);
      newVal.push(value.language);
      newVal.push(value.size);
      results.push(newVal);
    });

    return results;
  }
}