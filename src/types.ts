import type { ComponentType } from 'react';

export type ToastParams = { [key: string]: any };
export type ToastOptions = { [key: string]: any };

export type CustomDefaultOptions = {
  duration?: number;
  position?: 'top' | 'bottom';
};

export interface ToastStack<P extends ToastParams> {
  names: Array<Exclude<keyof P, symbol | number>>;
  content: ToastStackItem<P>[];
  defaultOptions: ToastOptions;
  openedItems: Set<ToastStackItem<P>>;
  openedItemsSize: number;
}

export interface ToastStackItem<P extends ToastParams> {
  name: Exclude<keyof P, symbol | number>;
  component: ComponentType<any> & { toastOptions?: ToastOptions };
  hash: string;
  index: number;
  options?: CustomDefaultOptions;
  defaultOptions: CustomDefaultOptions;
  params?: any;
  callback?: () => void;
}

export interface ToastStackType<P extends ToastParams> {
  name: Exclude<keyof P, symbol | number>;
  component: ComponentType<any> & { toastOptions?: ToastOptions };
  hash: string;
  index: number;
  options?: ToastOptions;
  params?: any;
  callback?: () => void;
}

export type ToastPendingClosingAction =
  | {
      hash: string;
      currentToastHash?: string;
      toastName?: string;
      action: 'closeToast';
      callback?: () => void;
    }
  | {
      hash: string;
      currentToastHash?: string;
      toastName: string;
      action: 'closeToasts';
      callback?: () => void;
    }
  | {
      hash: string;
      currentToastHash?: string;
      action: 'closeAllToasts';
      callback?: () => void;
    };

export interface ToastContextProvider<
  P extends ToastParams,
  M extends Exclude<keyof P, symbol | number> = Exclude<keyof P, symbol | number>
> {
  currentToast: M | null;
  closeAllToasts: (callback?: () => void) => void;
  closeToast: (stackItem?: M | ToastStackItem<P>, callback?: () => void) => void;
  closeToasts: (toastName: M, callback?: () => void) => boolean;
  getParam: <N extends keyof P[M], D extends P[M][N]>(
    hash: ToastStackItem<P>['hash'],
    paramName: N,
    defaultValue?: D
  ) => D extends P[M][N] ? P[M][N] : undefined;
  openToast: <N extends M>(ToastName: N, params?: P[N], callback?: () => void) => void;
  stack: ToastStack<P>;
}

export interface SharedProps<P extends ToastParams> extends ToastContextProvider<P> {}

export type ToastState<P> = Omit<ToastContextProvider<P>, 'currentToast' | 'stack' | 'openToast'> & {
  openToast: <M extends Exclude<keyof P, symbol | number>, N extends M>(args: {
    toastName: N;
    params?: P[N];
    callback?: () => void;
  }) => void;
  handleBackPress: () => boolean;
  init: <T>(updater: (currentState: ToastInternalState<T>) => ToastInternalState<T>) => ToastInternalState<T>;
  getState: <T>() => ToastInternalState<T>;
  setState: <T>(updater: (currentState: ToastInternalState<T>) => ToastInternalState<T>) => ToastInternalState<T>;
  subscribe: <T>(listener: ToastStateListener<T>, equalityFn?: ToastStateEqualityChecker<T>) => ToastStateSubscription<T>;
  queueClosingAction: (action: Partial<ToastPendingClosingAction>) => ToastPendingClosingAction;
  removeClosingAction: (action: ToastPendingClosingAction) => boolean;
};

export type ToastStateEqualityChecker<P> = (currentState: ToastInternalState<P>, newState: ToastInternalState<P>) => boolean;
export type ToastInternalState<P> = {
  currentToast: ToastContextProvider<P>['currentToast'] | string | null;
  stack: ToastContextProvider<P>['stack'];
};

export interface ToastStateSubscription<P> {
  unsubscribe: ToastStateSubscriber<P>['unsubscribe'];
}
export interface ToastStateSubscriber<P> {
  state: ToastInternalState<P>;
  equalityFn: ToastStateEqualityChecker<P>;
  error: boolean;
  stateListener: ToastStateListener<P>;
  unsubscribe: () => boolean;
}
export type ToastStateListener<P> = (state: ToastInternalState<P> | null, error?: Error) => void;
export type ToastOnCloseEventCallback = (closingAction: { type: ToastClosingActionName; origin: ToastClosingActionOrigin }) => void;
export type ToastEventListeners = Set<{
  event: string;
  handler: ToastEventCallback;
}>;
export type ToastListener = (eventName: ToastEventName, callback: ToastEventCallback) => ToastEventListener;
export type ToastOnAnimateEventCallback = (value?: number) => void;
export type ToastEventCallback = ToastOnAnimateEventCallback | ToastOnCloseEventCallback;
export type ToastEventName = 'onAnimate' | 'onClose';
export type ToastClosingActionName = 'closeToast' | 'closeToasts' | 'closeAllToasts';
export type ToastClosingActionOrigin = 'default' | 'fling' | 'backdrop';
export type ToastEventListener = { remove: () => boolean };

export type UsableToastProp<P extends ToastParams> = Pick<
  ToastContextProvider<P>,
  'closeAllToasts' | 'closeToasts' | 'currentToast' | 'openToast'
> & {
  closeToast: (toastName?: Exclude<keyof P, symbol | number>, callback?: () => void) => void;
};

export interface ToastStackConfig {
  [key: string]: ComponentType<any> | ToastOptions;
}

export interface UsableToastComponentProp<P extends ToastParams, M extends keyof P>
  extends Omit<ToastContextProvider<P>, 'closeToast' | 'stack' | 'getParam'> {
  addListener: ToastListener;
  closeToast: (toastlName?: M, callback?: () => void) => void;
  getParam: <N extends keyof P[M], D extends P[M][N]>(paramName: N, defaultValue?: D) => D extends P[M][N] ? P[M][N] : undefined;
  removeAllListeners: () => void;
  params?: P[M];
}

/**
 * Interface of the `Toast` prop exposed by the library specifically to Toast components.
 *
 * @argument { unknown } ToastStackParamsList? - Interface of the whole Toast stack params.
 * @argument { unknown } Props? - Component's props interface.
 * @argument { string } ToastName? - Name of the current Toast
 *
 * Note: Components that are not used from `createToastStack()`'s config should employ `ToastProp` instead.
 *
 */
export type ToastComponentProp<P extends ToastParams, Props = unknown, M extends keyof P = keyof P> = Props & {
  /**
   * Interface of the `Toast` prop exposed by the library specifically to Toast components.
   *
   * Note: Components that are not used from `createToastStack()`'s config should employ `ToastProp` instead.
   *
   */
  toast: UsableToastComponentProp<P, M>;
};
