import * as rx from 'rxjs';

interface RxEndpoint<T> {
  input: rx.Subject<T>;
  output: rx.Subject<T>;
}

export default RxEndpoint;
