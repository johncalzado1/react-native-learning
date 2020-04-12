import React, { useState, useEffect } from 'react';
import { Portal, Title, Button, Caption, Dialog, Text, Subheading } from 'react-native-paper'
import { View, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TimeInputControl } from '../theme'
import { theme_file } from '../theme_file';

const styles = StyleSheet.create({
    button: {
        marginRight: 10,
        marginBottom: 10
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    }
});

export const AddTaskScreen = () => {
    return (
        <ScrollView style={{ margin: 10 }}>
            <CategorySection />
            <TimeSection />
        </ScrollView>
    )
}

const CategorySection = () => {
    const [task, toggleTask] = useState(undefined);
    const [subTask, toggleSubTask] = useState(undefined);
    const [taskTypes, setTaskTypes] = useState([])
    const [loading, setLoading] = useState(true);

    const [showSubTaskModal, toggleShowSubTaskModal] = useState(false)
    const ref = firestore().collection('task_type');

    const toggleButtonTask = (taskName) => {

        // if the task is already selected, then toggle it off
        if (task === taskName) {
            toggleTask('');
            toggleSubTask('')
        } else {
            toggleTask(taskName)
            toggleSubTask('')
            toggleShowSubTaskModal(true)
        }
    }

    const toggleButtonSubTask = (taskName) => {

        // if the task is already selected, then toggle it off
        if (subTask === taskName) {
            toggleSubTask('');
        } else {
            toggleSubTask(taskName)
            toggleShowSubTaskModal(false)
        }
    }

    useEffect(() => {
        return ref.onSnapshot((querySnapshot) => {
            const taskTypesList = [];
            querySnapshot.forEach(doc => {
                const { name, title } = doc.data();
                const taskObj = {
                    id: doc.id,
                    title,
                    name,
                    subtasks: {}
                };

                ref.doc(doc.id).collection('subtask_type').onSnapshot(subTaskQuerySnapshot => {
                    const subTaskTypes = [];
                    subTaskQuerySnapshot.forEach(subtask_doc => {

                        const { name, title } = subtask_doc.data();
                        subTaskTypes.push({
                            id: subtask_doc.id,
                            name,
                            title
                        });
                    });
                    taskObj['subtasks'] = subTaskTypes
                });
                taskTypesList.push(taskObj)
            });

            setTaskTypes(taskTypesList);

            if (loading) {
                setLoading(false);
            }
        });
    }, [])

    const renderOptions = () => {
        return taskTypes.map((option, i) => {
            return (
                <Button
                    key={i}
                    mode={(task === option.name) ? "contained" : "outlined"}
                    compact
                    color={(task === option.name) ? theme_file.colors.primary : theme_file.colors.text}
                    uppercase={false}
                    style={styles.button}
                    onPress={() => toggleButtonTask(option.name)}>
                    {option.title}
                </Button>
            )
        })
    }

    const renderSubOptions = () => {
        if (!task || task === '') return (<></>)
        const taskObj = taskTypes.find(taskObj => taskObj.name === task)
        console.log(taskObj)
        if ('subtasks' in taskObj) {
            if (taskObj['subtasks'].length < 1) return (<Text>No Sub Tasks</Text>)
            const subTasks = taskObj['subtasks'];
            return subTasks.map((option, i) => {
                return (
                    <Button
                        key={i}
                        mode={(subTask === option.name) ? "contained" : "outlined"}
                        compact
                        color={(subTask === option.name) ? theme_file.colors.primary : theme_file.colors.text}
                        uppercase={false}
                        style={styles.button}
                        onPress={() => toggleButtonSubTask(option.name)}>
                        {option.title}
                    </Button>
                )
            })
        } else {
            return (
                <Text>No Sub Tasks</Text>
            )
        }
    }

    const getSubTaskTitle = () => {
        const taskObj = taskTypes.find(taskObj => taskObj.name === task)
        const subTaskObj = taskObj['subtasks'].find(subTaskObj => subTaskObj.name === subTask)
        return subTaskObj.title
    }
    return (
        <View>
            <Title>Task</Title>
            <View style={styles.buttonContainer}>
                {renderOptions()}
            </View>
            {(subTask !== '' && subTask !== undefined) && (
                <Subheading>Sub Task: {getSubTaskTitle()}</Subheading>
            )}
            <Portal>
                <Dialog visible={showSubTaskModal} onDismiss={() => toggleShowSubTaskModal(false)}>
                    <Dialog.Title>Choose a sub task</Dialog.Title>
                    <Dialog.Content style={styles.buttonContainer}>
                        {renderSubOptions()}
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View >
    )
}

const TimeSection = () => {
    const [start, toggleStart] = useState(new Date())
    const [end, toggleEnd] = useState('')

    return (
        <View>
            <Title>Time</Title>
            <Caption>start</Caption>
            <TimeInputControl datetime={start} toggleDateTime={toggleStart} showCommonTimes />
            <Caption>end</Caption>
            <TimeInputControl datetime={end} toggleDateTime={toggleEnd} showCommonTimes />
        </View>
    );
}