import {BaseSearchTask} from './task';
import * as api from '../api';
import {RequestOptionsHelper} from '../helpers';
import * as https from 'https';

export class SearchTopRepo extends BaseSearchTask<api.SearchRepoResult> {
  execute(cb: (err: Error, data?: api.SearchRepoResult) => void) {
    var ro = RequestOptionsHelper.createSearchRepo();
    https
      .request(ro, this.getSearchRequestHandler<api.SearchRepoResult>((data) => {
        cb(null, data);
      }))
      .on('error', (err) => {
        // to do: log
        throw err;
      })
      .end();
  }
}
