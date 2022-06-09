import * as React from 'react';
import { ToastProvider, createToastStack, ToastStackConfig } from '../../src/index';
import Home from './Home';
import { Success } from './Success';
import { Warning } from './Warning';
import { Error } from './Error';

export interface ToastStackParamsList {
  Success: string;
  Error: string;
  Warning: string;
}

const toastStackConfig: ToastStackConfig = {
  Success: { toast: Success, duration: 6000, position: 'bottom' },
  Error: Error,
  Warning: Warning,
};

export default function App() {
  const stack = createToastStack<ToastStackParamsList>(toastStackConfig, { duration: 2000 });

  return (
    <ToastProvider stack={stack}>
      <Home />
    </ToastProvider>
  );
}
