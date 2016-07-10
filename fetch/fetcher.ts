import {RepoItem} from '../model';
import {SearchTopRepo} from '../tasks/searchTopRepo';
import {ProcessRepo} from '../tasks/processRepo';
import * as api from '../api';

export interface Fetcher<T> {
  execute(cb: (err: Error, data: T) => void): void;
}

export abstract class BaseFetcher<T> implements Fetcher<T> {
  abstract execute(cb: (err: Error, data: T) => void): void;
}

export class RepoItemsFetcher extends BaseFetcher<RepoItem[]> {
  execute(cb: (err: Error, data: RepoItem[]) => void): void {

    var searchRepoTask = new SearchTopRepo();
    searchRepoTask.execute((err: Error, data?: api.SearchRepoResult) => {
      if (err) throw err;

      var requests: Array<AsyncFunction<RepoItem>> = new Array<AsyncFunction<RepoItem>>();
      data.items.forEach((value) => {
        requests.push((callback) => {
          var processRepoTask = new ProcessRepo(value);
          processRepoTask.execute((err, data) => {
            if (err) throw err;
            callback(null, data);
          });
        });
      });

      async.parallel(requests, (err, results) => {
        if (err) throw err;
        cb(null, results);
      });
    });
  }
}