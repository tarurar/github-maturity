import * as config from './config';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import {RequestOptionsHelper} from './helpers';
import * as fs from 'fs';
import * as api from './api';
import * as async from 'async';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as serveStatic from 'serve-static';
import * as errorHandler from 'errorhandler';

let firebase = require('firebase');
let app = express();

app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());

app.route('/')
  .get((req, res) => {
    res.render('index', {
      body: '<b>Hello</b>'
    });
  });

app.use(serveStatic(path.join(__dirname, '/public')));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (app.get('env') === 'development') {
    let errHandler = errorHandler();
    errHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});

http.createServer(app).listen(config.get('port'), () => {
  console.log('Express server listening on port:', config.get('port'));
});

// https://api.github.com/search/repositories?q=stars:>10000+forks:>10000
// https://api.github.com/search/issues?q=state:open+repo:twbs/bootstrap+type:issue&per_page=1

// function getSearchRequestHandler<T>(dataHandler: (data: T) => void): (res: http.IncomingMessage) => void {
//   return (res: http.IncomingMessage) => {
//     let buffer: Buffer = null;

//     res.on('data', (data) => {
//       buffer = buffer ? buffer + data : data;
//     });

//     res.on('end', () => {
//       let o = JSON.parse(buffer.toString()) as T;
//       dataHandler(o);
//     });
//   };
// }

// firebase.initializeApp({
//   serviceAccount: './config/firebase.json',
//   databaseURL: 'https://github-maturity.firebaseio.com'
// });

// let db = firebase.database();
// let dbRef = db.ref('/');
// let reposRef = dbRef.child('repos');
// let roRepo = RequestOptionsHelper.createSearchRepo();
// let requests: Array<AsyncFunction<any>> = new Array<AsyncFunction<any>>();

// https
//   .request(roRepo, getSearchRequestHandler<api.SearchRepoResult>((repoResult) => {

//     repoResult.items.forEach((repo) => {
//       let roOpenIssue = RequestOptionsHelper.createSearchIssue(repo.full_name, 'open');
//       let roClosedIssue = RequestOptionsHelper.createSearchIssue(repo.full_name, 'closed');

//       requests.push((callback) => {
//         https
//           .request(roOpenIssue, getSearchRequestHandler<api.SearchIssueResult>((issueResult) => {
//             let jsonObject = { 'id': repo.id, 'project': { 'name': repo.full_name, openedIssues: issueResult.total_count || 0 } };
//             callback(null, jsonObject);
//           }))
//           .on('error', (err) => {
//             console.log('Search opened issues error description:', err);
//           })
//           .end();
//       });

//       requests.push((callback) => {
//         https
//           .request(roClosedIssue, getSearchRequestHandler<api.SearchIssueResult>((issueResult) => {
//             let jsonObject = { 'id': repo.id, 'project': { 'name': repo.full_name, closedIssues: issueResult.total_count || 0 } };
//             callback(null, jsonObject);
//           }))
//           .on('error', (err) => {
//             console.log('Search closed issues error description:', err);
//           })
//           .end();
//       });
//     });

//     async.parallel(requests, (err, results) => {
//       if (err) {
//         console.log('Error in async execution:', err);
//       }

//       let updates: Array<AsyncFunction<any>> = new Array<AsyncFunction<any>>();
//       results.forEach((value) => {

//         if (value.project.openedIssues) {
//           updates.push((callback) => {
//             reposRef.child(value.id).update({
//               'name': value.project.name,
//               'openedIssues': value.project.openedIssues,
//               'updateDate': new Date()
//             }, (err) => {
//               callback(err, null);
//             });
//           });
//         }

//         if (value.project.closedIssues) {
//           updates.push((callback) => {
//             reposRef.child(value.id).update({
//               'name': value.project.name,
//               'closedIssues': value.project.closedIssues,
//               'updateDate': new Date()
//             }, (err) => {
//               callback(err, null);
//             });
//           });
//         }
//       });

//       async.parallel(updates, (err, results) => {
//         if (err) {
//           console.log('Error in async [updates] execution:', err);
//         } else {
//           console.log('Finished');
//           process.exit(0);
//         }
//       });

//     });
//   }))
//   .on('error', (err) => {
//     console.log('Search repositories error description:', err);
//   })
//   .end();