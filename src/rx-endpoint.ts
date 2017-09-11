import * as rx from './urxjs';

interface RxEndpoint<T> {
  input: rx.Subject<T>;
  output: rx.Subject<T>;
}

export default RxEndpoint;
