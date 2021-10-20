import { SingleTon } from "./ToSingleTon";

interface Listener {
  callback: Function;
  target: any;
}

export abstract class BaseSignal extends SingleTon<BaseSignal>() {
  private listenerMap: Listener[] = [];
  private onceListenerMap: Listener[] = [];

  private doDispatch(...args: any) {
    this.excuteListener(...args);
    this.excuteOnce(...args);
  }

  private excuteListener(...args: any) {
    if (this.listenerMap && this.listenerMap.length > 0) {
      for (let listener of this.listenerMap) {
        listener.callback.apply(listener.target, args);
      }
    }
  }

  private excuteOnce(...args: any) {
    if (this.onceListenerMap && this.onceListenerMap.length > 0) {
      for (let listener of this.onceListenerMap) {
        listener.callback.apply(listener.target, args);
      }

      this.onceListenerMap.length = 0;
    }
  }

  private listen(callback: Function, target: any) {
    this.listenerMap.push({
      callback: callback,
      target: target,
    });
  }

  private listenOnce(callback: Function, target: any) {
    this.onceListenerMap.push({
      callback: callback,
      target: target,
    });
  }

  removeListener(callback: Function, target: any) {
    if (this.listenerMap && this.listenerMap.length > 0) {
      for (let i = 0; i < this.listenerMap.length; ++i) {
        let listener = this.listenerMap[i];
        if (listener.callback == callback && listener.target == target) {
          this.listenerMap.splice(i, 1);
          --i;
        }
      }
    }
  }

  removeTarget(target: any) {
    if (this.listenerMap && this.listenerMap.length > 0) {
      for (let i = 0; i < this.listenerMap.length; ++i) {
        let listener = this.listenerMap[i];
        if (listener.target == target) {
          this.listenerMap.splice(i, 1);
          --i;
        }
      }
    }
  }

  dispatch(): void;
  dispatch<T>(val: T): void;
  dispatch<T, U>(val1: T, val2: U): void;
  dispatch<T, U, O>(val1: T, val2: U, val3: O): void;
  dispatch<T, U, O, P>(val1: T, val2: U, val3: O, val4: P): void;
  dispatch<T, U, O, P, L>(
    val1?: T,
    val2?: U,
    val3?: O,
    val4?: P,
    val5?: L
  ): void;
  dispatch<T, U, O, P, L>(
    val1?: T,
    val2?: U,
    val3?: O,
    val4?: P,
    val5?: L
  ): void {
    this.doDispatch(val1, val2, val3, val4, val5);
  }

  addListener(callback: () => void, target: any): void;
  addListener<T>(callback: (val: T) => void, target: any): void;
  addListener<T, U>(callback: (val1: T, val2: U) => void, target: any): void;
  addListener<T, U, O>(
    callback: (val1: T, val2: U, val3: O) => void,
    target: any
  ): void;
  addListener<T, U, O, P>(
    callback: (val1: T, val2: U, val3: O, val4: P) => void,
    target: any
  ): void;
  addListener<T, U, O, P, L>(
    callback: (val1: T, val2: U, val3: O, val4: P, val5: L) => void,
    target: any
  ): void;
  addListener<T, U, O, P, L>(
    callback: (val1: T, val2: U, val3: O, val4: P, val5: L) => void,
    target: any
  ): void {
    this.listen(callback, target);
  }

  addOnce(callback: () => void, target: any): void;

  addOnce<T>(callback: (val: T) => void, target: any): void;

  addOnce<T, U>(callback: (val1: T, val2: U) => void, target: any): void;

  addOnce<T, U, O>(
    callback: (val1: T, val2: U, val3: O) => void,
    target: any
  ): void;

  addOnce<T, U, O, P>(
    callback: (val1: T, val2: U, val3: O, val4: P) => void,
    target: any
  ): void;

  addOnce<T, U, O, P, L>(
    callback: (val1: T, val2: U, val3: O, val4: P, val5: L) => void,
    target: any
  ): void;
  addOnce<T, U, O, P, L>(
    callback: (val1: T, val2: U, val3: O, val4: P, val5: L) => void,
    target: any
  ): void {
    this.listenOnce(callback, target);
  }
}
