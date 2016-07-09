import {BaseSearchTask} from './task';
import * as api from '../api';
import {RequestOptionsHelper} from '../helpers';
import * as https from 'https';

export class SearchRepoIssues extends BaseSearchTask<api.SearchIssueResult> {
  constructor(private repoName: string, private state: 'open' | 'closed') {
    super();
  }

  execute(cb: (err: Error, data?: api.SearchIssueResult) => void) {
    var ro = RequestOptionsHelper.createSearchIssue(this.repoName, this.state);

    https.
      request(ro, this.getSearchRequestHandler<api.SearchIssueResult>((data) => {
        cb(null, data);
      }))
      .on('error', (err) => {
        // to do : log
        throw err;
      })
      .end();
  }
}