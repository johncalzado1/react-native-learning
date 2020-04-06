import React from 'react';

import { Appbar, Button, FAB, Colors } from 'react-native-paper';
import { FlatList, StyleSheet } from 'react-native';

export const TaskList = () => {
  return (
    <>
      <Appbar style={styles.appBar}>
        <Appbar.Content title="LifeTracker" />
      </Appbar>
      <FlatList />
      <FAB
        style={styles.fab}
        icon="plus"
        color={Colors.white}
        onPress={() => console.log('Pressed')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.blue500
  },
  appBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: Colors.blue500
  }
});
