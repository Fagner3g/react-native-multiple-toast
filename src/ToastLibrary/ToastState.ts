import type {
  ToastStackItem,
  ToastStateListener,
  ToastInternalState,
  ToastStateSubscriber,
  ToastContextProvider,
  ToastStateSubscription,
  ToastStateEqualityChecker,
  ToastState as ToastStateType,
  ToastParams,
} from '../types';

import { invariant, defaultOptions } from '../utils';

const createToastState = (): ToastStateType<any> => {
  let state: ToastInternalState<any> = {
    currentToast: null,
    stack: {
      names: [],
      content: [],
      defaultOptions,
      openedItemsSize: 0,
      openedItems: new Set(),
    },
  };
  let stateListeners: Set<() => void> = new Set();

  const setState = <P>(updater: (currentState: ToastInternalState<P>) => ToastInternalState<P>) => {
    const newState = updater(state);
    state = {
      ...newState,
      stack: {
        ...newState.stack,
        openedItemsSize: newState.stack.openedItems.size,
      },
    };
    stateListeners.forEach((stateListener) => stateListener());
    return state;
  };

  const init = setState;

  const getState = <P>(): ToastInternalState<P> => state;

  const addStateSubscriber = <P>(stateSubscriber: ToastStateSubscriber<P>): ToastStateSubscription<P> => {
    function stateListener() {
      try {
        const currentState = getState<P>();
        if (!stateSubscriber.equalityFn(stateSubscriber.state, currentState)) {
          stateSubscriber.stateListener((stateSubscriber.state = currentState));
        }
      } catch (error) {
        stateSubscriber.error = true;
        stateSubscriber.stateListener(null, error as Error);
      }
    }

    stateListeners.add(stateListener);

    return { unsubscribe: () => stateListeners.delete(stateListener) };
  };

  const createStateSubscriber = <P>(
    stateListener: ToastStateListener<P>,
    equalityFn: ToastStateEqualityChecker<P>
  ): ToastStateSubscriber<P> => {
    return {
      stateListener,
      equalityFn,
      error: false,
      state: getState(),
      unsubscribe: () => true,
    };
  };

  const subscribe = <P>(
    stateListener: ToastStateListener<P>,
    equalityFn: ToastStateEqualityChecker<P> = Object.is
  ): ToastStateSubscription<P> => {
    return addStateSubscriber(createStateSubscriber(stateListener, equalityFn));
  };

  const openToast = <P>(props: { toastName: Exclude<keyof P, symbol | number>; params?: P; callback?: () => void }) => {
    const { toastName, params, callback } = props;
    const { stack } = state;
    const { content, names } = stack;

    invariant(toastName, "You didn't pass any toast name");
    invariant(
      names.some((name) => name === toastName),
      `'${toastName}' is not a valid toast name. Did you mean any of these: ${names.map((validName) => `\n• ${validName}`)}`
    );

    const stackItem = content.find((item) => item.name === toastName);
    const hash = `${toastName}_${Math.random().toString(36).substring(2, 11)}`;

    setState<P>((currentState) => ({
      currentToast: toastName,
      stack: {
        ...currentState.stack,
        openedItems: state.stack.openedItems.add(
          Object.assign({}, stackItem, {
            hash,
            callback,
            defaultOptions: stack.defaultOptions,
            ...(params && { params }),
          })
        ),
      } as ToastContextProvider<P>['stack'],
    }));
  };

  const getParam = <P extends ToastParams, N extends keyof P[keyof P], D extends P[keyof P][N]>(
    hash: ToastStackItem<P>['hash'],
    paramName: N,
    defaultValue?: D
  ): D extends P[keyof P][N] ? P[keyof P][N] : undefined => {
    const {
      stack: { openedItems },
    } = state;
    let stackItem: ToastStackItem<P> | undefined;

    openedItems.forEach((item) => {
      if (item.hash === hash) {
        stackItem = item;
      }
    });

    return stackItem?.params?.[paramName] ?? defaultValue;
  };

  const closeToast = <P>(closingElement?: Exclude<keyof P, symbol> | ToastStackItem<P>) => {
    const {
      stack: { openedItems, names },
    } = state;

    if (typeof closingElement === 'string') {
      invariant(
        names.some((name) => name === closingElement),
        `'${closingElement}' is not a valid toast name. Did you mean any of these: ${names.map((validName) => `\n• ${String(validName)}`)}`
      );

      let wasItemRemoved = false;
      let reversedOpenedItemsArray = Array.from(openedItems).reverse();

      reversedOpenedItemsArray.forEach((openedItem) => {
        if (openedItem.name === closingElement && !wasItemRemoved) {
          openedItems.delete(openedItem);
          wasItemRemoved = true;
        }
      });

      if (!wasItemRemoved) {
        console.warn(`There was no opened ${closingElement} toast.`);
      }
    } else if (closingElement && openedItems.has(closingElement as ToastStackItem<P>)) {
      openedItems.delete(closingElement as ToastStackItem<P>);
    } else {
      const staleStackItem = Array.from(openedItems).pop();
      if (staleStackItem) {
        openedItems.delete(staleStackItem);
      }
    }

    const openedItemsArray = Array.from(openedItems);

    setState((currentState) => ({
      currentToast: openedItemsArray?.[openedItemsArray?.length - 1]?.name,
      stack: { ...currentState.stack, openedItems },
    }));
  };

  const closeToasts = <P>(toastName: Exclude<keyof P, symbol>): boolean => {
    const {
      stack: { openedItems: oldOpenedItems, names },
    } = state;

    invariant(toastName, "You didn't pass any toast name to closeToast()");
    invariant(
      names.some((name) => name === toastName),
      `'${toastName}' is not a valid toast name. Did you mean any of these: ${names.map((validName) => `\n• ${String(validName)}`)}`
    );

    const newOpenedItems = new Set(oldOpenedItems);

    newOpenedItems.forEach((item) => {
      if (item.name === toastName) {
        newOpenedItems.delete(item);
      }
    });

    if (newOpenedItems.size !== oldOpenedItems.size) {
      const openedItemsArray = Array.from(newOpenedItems);
      setState((currentState) => ({
        currentToast: openedItemsArray?.[openedItemsArray?.length - 1]?.name,
        stack: { ...currentState.stack, openedItems: newOpenedItems },
      }));
      return true;
    }

    return false;
  };

  const closeAllToasts = () => {
    const { openedItems } = state.stack;

    openedItems.clear();

    setState((currentState) => ({
      currentToast: null,
      stack: { ...currentState.stack, openedItems },
    }));
  };

  return {
    init,
    setState,
    getState,
    getParam,
    openToast,
    subscribe,
    closeToast,
    closeToasts,
    closeAllToasts,
  };
};

const ToastState = createToastState();

/**
 * Function that exposes toast's API outside of React's context.
 *
 * Note: Do not use if you're inside a React component.
 * Please consider `useToast()` or `withToast()` instead.
 *
 * @returns Object containing all the functions and variables of the usual `toas` prop.
 *
 */
export const toast = <P extends ToastParams, M extends Exclude<keyof P, symbol | number> = Exclude<keyof P, symbol | number>>() => ({
  /**
   * This value returns the current open toas (`null` if none).
   *
   * @example toas().currentToast
   *
   */
  currentToast: ToastState.getState<P>()?.currentToast ?? null,
  /**
   * This function opens a toast based on the provided `toastName`.
   *
   * It will look at the stack passed to `<ToastProvider>` and add
   * the corresponding component to the current stack of open Toasts.
   * Alternatively, you can also provide some `params` that will be
   * accessible to that component.
   *
   * @example Toastfy().openToast('PokédexEntryToast', { id: 619, name: 'Lin-Fu' }, () => console.log('PokédexEntryToast Toast opened'))
   *
   */
  openToast: (toastName: M, params?: P[M], callback?: () => void) =>
    ToastState.openToast({
      toastName,
      params,
      callback,
    }),
});

export default ToastState;
