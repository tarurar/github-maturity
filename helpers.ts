import * as path from 'path';
import * as config from './config';
import * as http from 'http';
import {FirebaseRepoItemValue} from './model';

class GiHubOAuthBuilder {
  private static clientId: string = config.get('github:clientId');
  private static clientSecret: string = config.get('github:clientSecret');

  public static buildParametersString(): String {
    var keys = [
      ['client_id', this.clientId],
      ['client_secret', this.clientSecret]
    ].map((val) => {
      return val.join('=');
    });

    return keys.join('&');
  }
}

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
      path: path.normalize(['/', repoPath, '?', repoQuery, '&', GiHubOAuthBuilder.buildParametersString()].join('')),
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
      path: path.normalize(['/', issuePath, '?', issueQuery, '&', GiHubOAuthBuilder.buildParametersString()].join('')),
      headers: { 'user-agent': this.userAgent }
    };
  }
}

export class Convert {
  public static RepositoriesInfoToGoogleChart(repoList: Array<FirebaseRepoItemValue>): Array<Array<string | number>> {

    var results = [['ID', 'Quality', 'Stars', 'Language', 'Size']];
    repoList.forEach((value) => {
      let newVal = [];
      newVal.push(value.full_name);
      newVal.push((value.issues.closed || 0) - (value.issues.open || 0));
      newVal.push(value.stars);
      newVal.push(value.language);
      newVal.push(value.size);
      results.push(newVal);
    });

    return results;
  }
}