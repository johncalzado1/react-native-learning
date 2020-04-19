import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FAB, Colors, Button } from 'react-native-paper';
import { StyleSheet, Text } from 'react-native';

import { TaskList } from '../components/task_list'
import { screen_configs } from '../screen_configs';

const testUserValue = 'test';

export const TaskListScreen = ({ navigation }) => {
    const ref = firestore().collection('tasks');
    const [tasks, setTasks] = useState(undefined);
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

// const TestComponent = () => {
//     const [projectsFields, toggleProjectsFields] = useState({})
//     const [tasks, setTasks] = useState({})

//     useEffect(() => {
//         getProjectFields()
//         getAllTasks()
//     }, [])

//     const getProjectFields = () => {
//         firestore()
//             .collection('task_type')
//             .doc('self_projects')
//             .get()
//             .then(doc => {
//                 toggleProjectsFields(doc.data().fields)
//             })
//     }

//     const getAllTasks = () => {
//         firestore()
//             .collection('task_type')
//             .get()
//             .then(docs => {
//                 const _list = []
//                 docs.forEach(doc => {
//                     const data = doc.data()
//                     if ("fields" in data === false) {
//                         _list.push({ id: doc.id, ...data })
//                     }
//                 })
//                 setTasks(_list)
//             })
//     }

//     const addToFireStore = () => {
//         if (!tasks) return

//         tasks.forEach(task => {
//             firestore()
//                 .collection('task_type')
//                 .doc(task.id)
//                 .update({
//                     ...task,
//                     fields: projectsFields
//                 })
//                 .then(() => console.log("ADDED"))
//         })
//     }

//     const buttonPress = () => {
//         console.log(tasks, projectsFields)
//         addToFireStore()
//     }


//     return (<><Button onPress={buttonPress}>PRESS</Button></>)
// }

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.blue500
    }
});