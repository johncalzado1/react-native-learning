import React, { useState, useEffect } from 'react';
import { Portal, Title, Button, Caption, Dialog, Text, Subheading } from 'react-native-paper'
import { View, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TimeInputControl, FlexContainer } from '../theme'
import { theme_file } from '../theme_file';
import { RnFirebaseMultiSelectList } from '../components/rnfirebase_list/rnfirebase_list';

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

    // Form values
    const [task, toggleTask] = useState(undefined);
    const [subTask, toggleSubTask] = useState(undefined);
    const [extraFieldValues, toggleExtraFieldValues] = useState({})

    const [taskTypes, setTaskTypes] = useState([])
    const [loading, setLoading] = useState(true);

    const [showSubTaskModal, toggleShowSubTaskModal] = useState(false)
    const ref = firestore().collection('task_type');

    useEffect(() => {
        return ref.onSnapshot((querySnapshot) => {
            const taskTypesList = [];
            querySnapshot.forEach(doc => {

                const { name, title, fields } = doc.data();
                // console.log(fields)
                const taskObj = {
                    id: doc.id,
                    title,
                    name,
                    fields,
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


    const toggleButtonTask = (taskName) => {

        // if the task is already selected, then toggle it off
        if (task === taskName) {
            toggleTask('');
            toggleSubTask('')
        } else {
            toggleTask(taskName)
            toggleSubTask('')
        }

        const subTaskObj = getSubTasksObj(getSelectedTaskObj(taskName))
        if (subTaskObj === false) {
            toggleShowSubTaskModal(false)
        } else {
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

    const getSelectedTaskObj = (taskName) => {
        // console.log(taskName)
        if (!taskName) taskName = task
        if (taskName === '' || taskName === undefined) return false
        return taskTypes.find(taskObj => taskObj.name === taskName)
    }

    const getSubTasksObj = (taskObj) => {
        // console.log(taskObj)
        if ('subtasks' in taskObj) {
            const subTasks = taskObj['subtasks'];
            if (subTasks.length < 1 || Object.keys(subTasks).length === 0) return false
            return subTasks
        }
        return false
    }

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

        const returnNoSubTask = () => {
            return (<Text>No Sub tasks</Text>)
        }

        const taskObj = getSelectedTaskObj()
        if (!taskObj) {
            return (<Text>Invalid Task</Text>)
        }
        const subTasks = getSubTasksObj(taskObj)
        if (!subTasks) return returnNoSubTask()
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

    }

    const getSubTaskTitle = () => {
        const taskObj = getSelectedTaskObj()
        if (!taskObj) return "n/a";
        const subTasks = taskObj['subtasks'];
        if (Object.keys(subTasks).length === 0 || subTasks.length < 1) return "n/a"
        const subTaskObj = subTasks.find(subTaskObj => subTaskObj.name === subTask)
        return subTaskObj.title
    }

    const renderTaskExtraFields = () => {
        const taskObj = getSelectedTaskObj()
        if (taskObj === false) return (<Title>JUST NO</Title>)
        if ('fields' in taskObj) {
            const taskExtraFields = taskObj['fields']
            if (!taskExtraFields) return (<Title>NO FIELDS</Title>)
            const extraFields = taskExtraFields.map((field, index) => {
                const { type } = field
                switch (type) {
                    case 'fs_multi_select_list':
                        return (
                            <RnFirebaseMultiSelectList
                                extraFieldsObj={extraFields}
                                toggleExtraFieldsObj={toggleExtraFieldValues}
                                key={index} {...field}></RnFirebaseMultiSelectList>
                        )
                        break;
                }
            });
            return (<>{extraFields}</>)
        } else {
            return (<Title>NO FIELDS</Title>)
        }
    }

    return (
        <View>
            <Title>Task</Title>
            <View style={styles.buttonContainer}>
                {renderOptions()}
            </View>
            {(subTask !== '' && subTask !== undefined) && (
                <FlexContainer direction="row" alignItems="center">
                    <Subheading>Sub Task: </Subheading>
                    <Button mode="contained" uppercase={false} compact>{getSubTaskTitle()}</Button>
                </FlexContainer>
            )}
            {renderTaskExtraFields()}
            <Portal>
                <Dialog visible={showSubTaskModal} onDismiss={() => toggleShowSubTaskModal(false)}>
                    <Dialog.Title>Choose a sub task</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView contentContainerStyle={{ ...styles.buttonContainer, marginTop: 10 }}>
                            {renderSubOptions()}
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => toggleShowSubTaskModal(false)}>Ok</Button>
                    </Dialog.Actions>
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