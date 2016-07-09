import * as http from 'http';

export interface Task<TResult> {
  execute(cb: (err: Error, data?: TResult) => void): void;
}

export abstract class BaseTask<T> implements Task<T> {
  abstract execute(cb: (err: Error, data?: T) => void): void;
}

export abstract class BaseSearchTask<T> extends BaseTask<T> {
  protected getSearchRequestHandler<T>(handler: (data: T) => void): (res: http.IncomingMessage) => void {
    return (res: http.IncomingMessage) => {
      let buffer: Buffer = null;

      res.on('data', (data) => {
        buffer = buffer ? buffer + data : data;
      });

      res.on('end', () => {
        let o = JSON.parse(buffer.toString()) as T;
        handler(o);
      });
    };
  }
}