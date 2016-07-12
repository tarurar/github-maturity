import {RepoItemsFetcher, FireBaseFetcher} from './fetch/fetcher';
import {SaveRepo} from './tasks/saveRepo';
import * as config from './config';
import * as async from 'async';
import {FirebaseRepoItemValue} from './model';
var firebase = require('firebase');

firebase.initializeApp({
  serviceAccount: './config/firebase.json',
  databaseURL: config.get('urls:database')
});

var db = firebase.database();
var dbRef = db.ref('/');

var fetcher = new RepoItemsFetcher();
fetcher.execute((err, data) => {
  if (err) throw err;

  var requests: Array<AsyncFunction<boolean>> = new Array<AsyncFunction<boolean>>();
  data.forEach((value) => {
    requests.push((callback) => {
      var saveTask = new SaveRepo(dbRef, value);
      saveTask.execute((err, data) => {
        callback(err, !err);
      });
    });
  });

  async.parallel(requests, (err, results) => {
    if (err) throw err;
    console.log('Finished');

    process.exit(0);
  });
});