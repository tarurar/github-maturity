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

var app = express();
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