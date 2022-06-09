import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import type { SharedProps, ToastParams, ToastStackItem } from 'src/types';
import StackItem from './StackItem';

type Props<P> = SharedProps<P>;

const ToastStack = <P extends ToastParams>(props: Props<P>): Element | any => {
  const { stack } = props;

  const renderStackItem = (stackItem: ToastStackItem<P>) => {
    return <StackItem key={stackItem.hash} stackItem={stackItem} {...props} />;
  };

  const renderStack = () => {
    if (!stack.openedItemsSize) {
      return null;
    }
    return [...stack.openedItems].map(renderStackItem);
  };

  return <View style={styles.container}>{renderStack()}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    marginTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : StatusBar.currentHeight,
  },
});

export default ToastStack;
