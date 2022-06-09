import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, SafeAreaView } from 'react-native';
import type { SharedProps, ToastParams, ToastStackItem } from 'src/types';

type Props<P> = SharedProps<P> & {
  stackItem: ToastStackItem<P>;
};

const StackItem = <P extends ToastParams>(props: Props<P>) => {
  const { stackItem, closeToast } = props;
  const Component = stackItem.component;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const duration = stackItem.options ? stackItem.options.duration : stackItem.defaultOptions.duration;

  useEffect(() => {
    Animated.spring(opacity, { toValue: 0.7, delay: 100, useNativeDriver: true }).start();
    Animated.timing(translateY, { toValue: 20, delay: 100, useNativeDriver: true }).start();

    setTimeout(() => {
      closeCurrentToast(stackItem);
    }, duration);
  }, []);

  const closeCurrentToast = useCallback((stackItem: ToastStackItem<any>) => {
    Animated.timing(opacity, { toValue: 0, delay: 100, duration: 700, useNativeDriver: true }).start();
    Animated.timing(translateY, { toValue: -20, delay: 100, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: -20, delay: 100, duration: 2000, useNativeDriver: true }).start();

    setTimeout(() => {
      closeToast(stackItem);
    }, 700);
  }, []);

  return (
    <SafeAreaView style={{ elevation: 100, zIndex: 100 }}>
      <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }} key={stackItem.hash}>
        {/* @ts-ignore */}
        <Component
          toast={{
            closeToast: () => closeCurrentToast(stackItem),
            params: stackItem.params,
          }}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default StackItem;
