import React, { ReactNode, useState, useEffect, useRef } from 'react';
import type {
  SharedProps,
  ToastContextProvider,
  ToastStack as ToastStackAsType,
  ToastStateListener,
  ToastStateSubscription,
} from 'src/types';

import { invariant } from '../utils';
import ToastContext from './ToastContext';
import ToastStack from './ToastStack';
import ToastState from './ToastState';

interface Props {
  children: ReactNode;
  stack: ToastStackAsType<any>;
}

/**
 * `<ToastProvider>` is the component you're going to use to wrap your whole application,
 * so it'll be able to display your Toasts on top of everything else, using React Context API.
 *
 * @prop { ToastStackType } `stack` - Toast stack object generated by `createToastStack()`
 */
const ToastProvider = ({ children, stack }: Props) => {
  const toastStateSubscription = useRef<ToastStateSubscription<any> | undefined>();

  const openToast: SharedProps<any>['openToast'] = (toastName, params, callback) => {
    ToastState.openToast({ toastName, params, callback });
  };

  const getParam: SharedProps<any>['getParam'] = (hash, paramName, defaultValue) => ToastState.getParam(hash, paramName, defaultValue);

  const closeToast: SharedProps<any>['closeToast'] = (stackItem) => ToastState.closeToast(stackItem);

  const closeAllToasts: SharedProps<any>['closeAllToasts'] = () => ToastState.closeAllToasts();

  const [contextValue, setContextValue] = useState<ToastContextProvider<any, any>>({
    stack,
    getParam,
    openToast,
    closeToast,
    closeAllToasts,
    currentToast: null,
  });

  useEffect(() => {
    invariant(stack, 'You need to provide a `stack` prop to <ToastProvider>');
    ToastState.init<any>(() => ({ currentToast: null, stack }));
    toastStateSubscription.current = ToastState.subscribe(listener);

    return () => {
      toastStateSubscription.current?.unsubscribe();
    };
  }, []);

  const listener: ToastStateListener<any> = (toastState, error) => {
    if (toastState) {
      setContextValue({
        ...contextValue,
        currentToast: toastState.currentToast,
        stack: toastState.stack,
      });
    } else console.warn('Toast', error);
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastStack {...contextValue} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
