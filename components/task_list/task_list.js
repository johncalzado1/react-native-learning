import React from 'react';
import { Appbar, FAB, Colors } from 'react-native-paper';
import { FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';

import { TaskItem } from './task_item'

export const TaskList = ({ isLoading, data }) => {
  if (!data) return (<ActivityIndicator size="large" />)
  return (
    <>
      <Appbar style={styles.appBar}>
        <Appbar.Content title="LifeTracker" />
      </Appbar>
      <FlatList
        style={{ flex: 1 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem {...item} />}
      />
      < FAB
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
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: Colors.blue500
  }
});
