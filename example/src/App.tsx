import * as React from 'react';
import { ToastProvider, createToastStack, ToastStackConfig, ToastOptions } from '../../src/index';
import { Animated, Dimensions } from 'react-native';
import Home from './Home';
import { Success } from './Success';
import { Warning } from './Warning';
import { Error } from './Error';

export interface ToastStackParamsList {
  Success: string;
  Error: string;
  Warning: string;
}

const config: ToastStackConfig = {
  Success: Success,
  Error: Error,
  Warning: Warning,
};

const { width } = Dimensions.get('screen');

const animate = (animatedValue: Animated.Value, toValue: number, callback?: () => void) => {
  Animated.spring(animatedValue, {
    toValue,
    damping: 10,
    mass: 0.35,
    stiffness: 100,
    overshootClamping: true,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    useNativeDriver: true,
  }).start(({ finished }) => {
    if (finished) callback?.();
  });
};

const defaultOptions: ToastOptions = {
  backdropOpacity: 0.4,
  animationIn: animate,
  animationOut: animate,
  transitionOptions: (animatedValue: any) => ({
    opacity: animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0.9],
    }),
    transform: [
      { perspective: 2000 },
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [-width / 1.5, 0, width / 1.5],
          extrapolate: 'clamp',
        }),
      },
      {
        rotateY: animatedValue.interpolate({
          inputRange: [0, 1, 2],
          outputRange: ['90deg', '0deg', '-90deg'],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [1.2, 1, 0.9],
          extrapolate: 'clamp',
        }),
      },
    ],
  }),
};

export default function App() {
  const stack = createToastStack<ToastStackParamsList>(config, defaultOptions);

  return (
    <ToastProvider stack={stack}>
      <Home />
    </ToastProvider>
  );
}
