import React from 'react';
import { List } from 'react-native-paper';

export const TaskItem = ({ id, title, start, end, complete, category }) => {
  return (
    <List.Item
      title={title}
      left={props => (
        <List.Icon {...props} />
      )}
    />
  );
};
