import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';

import { TaskItem } from './task_item'

export const TaskList = ({ isLoading, data }) => {
  if (!data) return (<ActivityIndicator size="large" />)
  return (
    <>
      <FlatList
        style={{ flex: 1 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem {...item} />}
      />
    </>
  );
};


