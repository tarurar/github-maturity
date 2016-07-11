import * as config from './config';
import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as serveStatic from 'serve-static';
import * as errorHandler from 'errorhandler';
import {FireBaseFetcher} from './fetch/fetcher';
import {Convert} from './helpers';
var firebase = require('firebase');

var app = express();
// configure app
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

// configure database access
firebase.initializeApp({
  serviceAccount: './config/firebase.json',
  databaseURL: config.get('urls:database')
});
var db = firebase.database();
var dbRef = db.ref('/');

// middlewares
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());

app.route('/')
  .get((req, res) => {

    getDataForChart(dbRef, (err, data) => {
      if (err) throw err;
      res.render('index', {
        names: data
      });
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

function getDataForChart(dbRef: any, cb: (err: Error, data: Array<Array<string | number>>) => void): void {
  var fetcher = new FireBaseFetcher(dbRef);
  fetcher.execute((err, data) => {
    let convertedData = Convert.RepositoriesInfoToGoogleChart(data);
    cb(err, convertedData);
  });
}