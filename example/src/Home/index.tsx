import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useToast } from '../../../src';
import type { ToastStackParamsList } from '../App';

const Home: React.FC = () => {
  const { openToast } = useToast<ToastStackParamsList>();

  return (
    <View style={styles.container}>
      <Button title="Sucesso" onPress={() => openToast('Success', 'Success')} />
      <Button title="Erro" onPress={() => openToast('Error', 'Error')} />
      <Button title="Alerta" onPress={() => openToast('Warning', 'Warning')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
