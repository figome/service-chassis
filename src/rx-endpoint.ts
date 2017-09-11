import * as rx from './abstract-rx';

interface RxEndpoint<T> {
  input: rx.Subject<T>;
  output: rx.Subject<T>;
}

export default RxEndpoint;
