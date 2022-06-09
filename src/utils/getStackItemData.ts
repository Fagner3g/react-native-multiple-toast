import type { ComponentType } from 'react';
import { isValidElementType } from 'react-is';

import type { ToastOptions } from '../types';

export default function <P>(toastName: Exclude<keyof P, symbol | number>, toastComponent: ComponentType<any> | ToastOptions) {
  if (
    ('toast' in toastComponent && !isValidElementType(toastComponent.toast)) ||
    ('toast' in toastComponent === false && !isValidElementType(toastComponent))
  ) {
    throw new Error(`The component for toast '${toastName}' must be a valid React component. For instance:
      import MyToast from './MyToast';

        ...
        ${toastName}: MyToast,
      }

      You can also use an object:
        ...
        ${toastName}: {
          toast: MyToast
        },
      }`);
  }

  let options;
  let toastObj;

  if ('toast' in toastComponent) {
    const { toast, ...rest } = toastComponent;
    toastObj = toast;
    options = rest;
  }

  return {
    component: toastObj || toastComponent,
    name: toastName,
    options,
  };
}
