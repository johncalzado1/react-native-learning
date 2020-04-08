import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FAB, Colors } from 'react-native-paper';
import { StyleSheet } from 'react-native';

import { TaskList } from '../components/task_list'
import { screen_configs } from '../screen_configs';

const testUserValue = 'test';

export const TaskListScreen = ({ navigation }) => {
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

    return (
        <>
            <TaskList isLoading={loading} />
            < FAB
                style={styles.fab}
                icon="plus"
                color={Colors.white}
                onPress={() => navigation.navigate(screen_configs.AddTaskScreen.name)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.blue500
    }
});