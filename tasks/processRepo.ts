import {SearchRepoIssues} from './searchRepoIssues';
import {BaseSearchTask} from './task';
import * as api from '../api';
import {RepoItem} from '../model';
import * as async from 'async';
import * as extend from 'extend';

interface IssuesCount {
  type: 'open' | 'closed';
  total: number;
}

export class ProcessRepo extends BaseSearchTask<RepoItem> {
  constructor(private item: api.SearchRepoItem) {
    super();
  }

  // to do : fix this json manipulation (not good)
  private prepareResult(issues: IssuesCount[]): RepoItem {
    var issuesObject: any = {};
    issues.forEach((value) => {
      if (value.type === 'open') {
        issuesObject = extend(true, issuesObject, { 'open': value.total });
      }
      else {
        issuesObject = extend(true, issuesObject, { 'closed': value.total });
      }
    });
    issuesObject = { 'issues': issuesObject};

    return extend(true, this.item, issuesObject) as RepoItem;
  }

  execute(cb: (err: Error, data?: RepoItem) => void): void {
    var requests: Array<AsyncFunction<IssuesCount>> = new Array<AsyncFunction<IssuesCount>>();
    requests.push((callback) => {
      var openedIssuesTask = new SearchRepoIssues(this.item.full_name, 'open');
      openedIssuesTask.execute((err, data) => {
        if (err) throw err;

        callback(null, { type: 'open', total: data.total_count });
      });
    });

    requests.push((callback) => {
      var closedIssuesTask = new SearchRepoIssues(this.item.full_name, 'closed');
      closedIssuesTask.execute((err, data) => {
        if (err) throw err;

        callback(null, { type: 'closed', total: data.total_count });
      });
    });

    async.parallel(requests, (err, results) => {
      cb(err, this.prepareResult(results));
    });
  }
}