import type { CustomDefaultOptions } from '../types';

export const defaultOptions: CustomDefaultOptions = {
  duration: 4000,
  position: 'top',
};

export { default as invariant } from './invariant';
export { default as getStackItemData } from './getStackItemData';
