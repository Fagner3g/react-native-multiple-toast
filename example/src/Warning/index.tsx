import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ToastComponentProp } from '../../../src';
import { ToastStackParamsList } from '../App';

export const Warning = (props: ToastComponentProp<ToastStackParamsList, void, 'Success'>) => {
  const { closeToast, params } = props.toast;
  console.log(props.toast.closeAllToasts);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`Teste: ${params}`}</Text>
      <Button title="X" color={'white'} onPress={() => closeToast()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    margin: 2,
  },
  text: {
    color: 'white',
  },
});
