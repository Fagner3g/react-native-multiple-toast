import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import type { SharedProps, ToastParams } from 'src/types';
import StackItem from './StackItem';

type Props<P> = SharedProps<P>;
const ToastStack = <P extends ToastParams>(props: Props<P>) => {
  const { stack } = props;

  if (!stack.defaultOptions) {
    return null;
  }

  const top = [...stack.openedItems].filter((item) => {
    if (item.options?.position) {
      if (item.options?.position === 'top') {
        return item;
      }
      return null;
    }
    if (item.defaultOptions.position === 'top') {
      return item;
    }
    return null;
  });

  const bottom = [...stack.openedItems].filter((item) => {
    if (item.options?.position) {
      if (item.options?.position === 'bottom') {
        return item;
      }
      return null;
    }
    if (item.defaultOptions.position === 'bottom') {
      return item;
    }
    return null;
  });

  return (
    <>
      <View style={styles.top}>
        {top.map((item) => {
          return <StackItem key={item.hash} stackItem={item} {...props} />;
        })}
      </View>
      <View style={styles.bottom}>
        {bottom.map((item) => {
          return <StackItem key={item.hash} stackItem={item} {...props} />;
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    width: '100%',
    marginTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : StatusBar.currentHeight,
  },
  bottom: {
    position: 'absolute',
    width: '100%',
    bottom: 20,
  },
});

export default ToastStack;
