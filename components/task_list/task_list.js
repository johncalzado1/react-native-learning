import React from 'react';
import { FlatList, ActivityIndicator, Text } from 'react-native';
import { TaskItem } from './task_item'

export const TaskList = ({ isLoading, data }) => {
  if (isLoading === true) return (<ActivityIndicator size="large" />)
  if (!data) return (<Text>No Data</Text>)
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


