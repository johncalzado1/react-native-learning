import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

import { TaskList } from './components/task_list';

const testUserValue = 'test';

export const AppContainer = () => {
  const ref = firestore().collection('tasks');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ref.where('user', '==', testUserValue.toString())
      .onSnapshot((querySnapshot) => {
        const list = [];
        querySnapshot.forEach(doc => {
          const { title, start, end, complete, category } = doc.data();
          list.push({
            id: doc.id,
            title,
            complete,
            start,
            end,
            category
          });
        });

        setTasks(list);

        if (loading) {
          setLoading(false);
        }
      });
  }, [])

  return <TaskList isLoading={loading} />;
};
