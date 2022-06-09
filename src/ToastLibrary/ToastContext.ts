import { createContext } from 'react';

import type { ToastContextProvider, ToastParams } from '../types';

const createModalContext = <ModalStackParamsList extends ToastParams>() => {
  const ModalContext = createContext<Partial<ToastContextProvider<ModalStackParamsList>>>({});
  ModalContext.displayName = 'Toast';

  return ModalContext;
};

export default createModalContext();
