import {RepoItem, FirebaseRepoItemValue} from '../model';
import {SearchTopRepo} from '../tasks/searchTopRepo';
import {ProcessRepo} from '../tasks/processRepo';
import * as api from '../api';
import * as async from 'async';

export interface Fetcher<T> {
  execute(cb: (err: Error, data: T) => void): void;
}

export abstract class BaseFetcher<T> implements Fetcher<T> {
  abstract execute(cb: (err: Error, data: T) => void): void;
}

/**
 * Implements logic for getting repository items from GitHub
 * 
 * @export
 * @class RepoItemsFetcher
 * @extends {BaseFetcher<RepoItem[]>}
 */
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
        cb(err, results);
      });
    });
  }
}

/**
 * Implements logic for getting items from Firebase
 * 
 * @export
 * @class FireBaseFetcher
 * @extends {BaseFetcher<any>}
 */
export class FireBaseFetcher extends BaseFetcher<FirebaseRepoItemValue[]> {
  constructor(private dbContext: any) {
    super();
  }

  execute(cb: (err: Error, data: FirebaseRepoItemValue[]) => void): void {
    var tableRef = this.dbContext.child('repos');
    var results: Array<FirebaseRepoItemValue> = new Array<FirebaseRepoItemValue>();

    tableRef.once('value', (snapshot) => {
      let table = snapshot.val();
      for (let key in table) {
        let item = table[key] as FirebaseRepoItemValue;
        results.push(item);
      }

      cb(null, results);
    }, (err) => {
      cb(err, null);
    });
  }
}