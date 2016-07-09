import {SearchTopRepo} from './tasks/searchTopRepo';
import {ProcessRepo} from './tasks/processRepo';
import {RepoItem} from './model';
import * as api from './api';

let searchRepoTask = new SearchTopRepo();
searchRepoTask.execute((err: Error, data?: api.SearchRepoResult) => {
  if (err) throw err;
  if (!data) throw new Error('Data is null');

  var requests: Array<AsyncFunction<RepoItem>>;
  data.items.forEach((value) => {
    var processRepoTask = new ProcessRepo(value);
    processRepoTask.execute((err, data) => {
      if (err) throw err;

    });
  });
});
