import { Dimensions, Easing } from 'react-native';

import type { ToastOptions } from '../types';

export const vw = (percentage: number) => (Dimensions.get('window').width * percentage) / 100;

export const vh = (percentage: number) => (Dimensions.get('window').height * percentage) / 100;

export const sh = (percentage: number) => (Dimensions.get('screen').height * percentage) / 100;

export const defaultOptions: ToastOptions = {
  animateInConfig: {
    duration: 450,
    easing: Easing.inOut(Easing.exp),
  },
  animateOutConfig: {
    duration: 450,
    easing: Easing.inOut(Easing.exp),
  },
  containerStyle: {},
  position: 'center',
  backBehavior: 'pop',
  backdropOpacity: 0.6,
  disableFlingGesture: false,
  backdropAnimationDuration: 300,
};

export { default as invariant } from './invariant';
export { default as getStackItemData } from './getStackItemData';
export { default as getStackItemOptions } from './getStackItemOptions';
export { default as validateDefaultOptions } from './validateDefaultOptions';
