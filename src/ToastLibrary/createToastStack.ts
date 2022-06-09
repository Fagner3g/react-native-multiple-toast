import type { ToastStack, ToastStackConfig, CustomDefaultOptions } from '../types';

import { invariant, defaultOptions, getStackItemData, validateDefaultOptions } from '../utils';

/**
 * `createToastStack()` is the function that's going to turn your configuration into a usable Toast stack.
 *
 * @argument { ToastStackConfig } config - Toast stack configuration.
 * @argument { CustomDefaultOptions } [customDefaultOptions] - Configuration options to apply to all Toasts by default (optional).
 *
 * @returns { ToastStack } Toast stack configuration object to provide to `<ToastProvider>`'s `stack` prop.
 */
export default function <P>(config: ToastStackConfig, customDefaultOptions?: CustomDefaultOptions): ToastStack<P> {
  invariant(config, 'You need to provide a config to createToastStack()');
  validateDefaultOptions(customDefaultOptions);

  const initialStack: ToastStack<P> = {
    names: [],
    content: [],
    defaultOptions: {
      ...defaultOptions,
      ...customDefaultOptions,
    },
    openedItemsSize: 0,
    openedItems: new Set(),
  };

  return Object.entries(config).reduce<ToastStack<P>>((output, entry, index): ToastStack<P> => {
    const { name, component, options } = getStackItemData(entry[0], entry[1]);
    return {
      ...output,
      names: [...output.names, name] as ToastStack<P>['names'],
      content: [...output.content, { index, name, component, hash: '', ...(options && { options }) }] as ToastStack<P>['content'],
    };
  }, initialStack);
}
