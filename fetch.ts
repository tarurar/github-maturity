import {SearchTopRepo} from './tasks/searchTopRepo';
import {ProcessRepo} from './tasks/processRepo';
import {RepoItem} from './model';
import * as api from './api';
import * as async from 'async';

let searchRepoTask = new SearchTopRepo();
searchRepoTask.execute((err: Error, data?: api.SearchRepoResult) => {
  if (err) throw err;
  if (!data) throw new Error('Data is null');

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

    results.forEach((value) => {
      console.log('Project name:', value.full_name, ', forks: ', value.forks_count,
        ', stars:', value.stargazers_count, ', language:', value.language, ', size (kb): ', value.size,
        ', issues open:', value.issues.open, ', issues closed:', value.issues.closed);
    });
  });
});
