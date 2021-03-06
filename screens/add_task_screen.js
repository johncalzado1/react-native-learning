import React, { useState, useEffect } from 'react';
import { Portal, Title, Button, Caption, Dialog, Text, Subheading } from 'react-native-paper'
import { View, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TimeInputControl, FlexContainer } from '../theme'
import { theme_file } from '../theme_file';
import { RnFirebaseMultiSelectList } from '../components/rnfirebase_list/rnfirebase_list';
import { ModalList } from '../components/modal_list/modal_list';
import { configs } from '../config';
import { helpers } from '../helpers';

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
    const [values, toggleValues] = useState({})
    const submitTask = () => {
        console.log("TASK", values)
    }
    return (
        <ScrollView style={{ margin: 10 }}>
            <CategorySection values={values} toggleValues={toggleValues} />
            <TimeSection />
            <Button onPress={submitTask}>Add</Button>
        </ScrollView>
    )
}

const CategorySection = ({ values, toggleValues }) => {

    // Form values
    const [task, toggleTask] = useState(undefined);
    const [extraFieldValues, toggleExtraFieldValues] = useState({})

    const [taskTypes, setTaskTypes] = useState([])
    const [loading, setLoading] = useState(true);

    const [modalVisible, toggleModalVisible] = useState(true)

    const ref = firestore().collection(configs.taskCollection);

    const extraFieldsToggler = (value) => {
        // console.log("extra fields", extraFieldValues, value)
        toggleExtraFieldValues({ ...extraFieldValues, ...value })
    }

    useEffect(() => {
        updateCategorySectionValues()
        return ref.onSnapshot((querySnapshot) => {
            const taskTypesList = [];
            querySnapshot.forEach(doc => {

                const { name, title, fields } = doc.data();
                taskTypesList.push(taskObj = {
                    id: doc.id,
                    title,
                    name,
                    fields
                })
            });

            setTaskTypes(taskTypesList);

            if (loading) {
                setLoading(false);
            }
        });
    }, [task, extraFieldValues])

    const updateCategorySectionValues = () => {
        const taskValues = { task: task }
        // console.log("update category", values, extraFieldValues, taskValues)
        toggleValues({ ...values, ...extraFieldValues, ...taskValues })
    }

    const toggleButtonTask = (taskName) => {

        // if the task is already selected, then toggle it off
        // console.log(task, taskName)
        // toggleExtraFieldValues({ ...extraFieldValues, ...helpers.setAllKeysToUndefined(extraFieldValues) })
        if (task === taskName) {
            toggleTask(undefined);
            return
        } else {
            toggleTask(taskName)
        }


    }

    const getSelectedTaskObj = (taskName) => {
        // console.log(taskName)
        if (!taskName) taskName = task
        if (taskName === '' || taskName === undefined) return false
        return taskTypes.find(taskObj => taskObj.id === taskName)
    }

    const renderOptions = () => {
        return taskTypes.map((option, i) => {
            return (
                <Button
                    key={i}
                    mode={(task === option.id) ? "contained" : "outlined"}
                    compact
                    color={(task === option.id) ? theme_file.colors.primary : theme_file.colors.text}
                    uppercase={false}
                    style={styles.button}
                    onPress={() => toggleButtonTask(option.id)}>
                    {option.title}
                </Button>
            )
        })
    }

    const getTaskTitle = () => {
        let _val = ''
        if (!task || task === '') {
            _val = task
        } else {
            _val = helpers.findValueInArrayOfObjs(taskTypes, task, 'id')
            // console.log(_val)
            _val = _val['title']
        }
        return _val
    }

    const renderTaskExtraFields = () => {
        const taskObj = getSelectedTaskObj()
        if (taskObj === false) return
        if ('fields' in taskObj) {
            const taskExtraFields = taskObj['fields']
            if (!taskExtraFields) return
            const extraFields = taskExtraFields.map((field, index) => {
                const { type } = field
                // console.log("TYPE", type, field)
                switch (type) {
                    case 'fs_multi_select_list_with_search':
                        return (
                            <RnFirebaseMultiSelectList
                                toggleModalVisible={toggleModalVisible}
                                modalVisible={modalVisible}
                                toggleOutput={extraFieldsToggler}
                                key={index} {...field}></RnFirebaseMultiSelectList>
                        )
                        break;
                    case 'modal_list_with_add':
                        return (
                            <ModalList
                                toggleModalVisible={toggleModalVisible}
                                modalVisible={modalVisible}
                                task={getTaskTitle()}
                                toggleOutput={extraFieldsToggler}
                                key={index}
                                fireBaseRef={[
                                    { type: 'collection', value: configs.taskCollection },
                                    { type: 'document', value: taskObj.id }
                                ]}
                                {...field}></ModalList>
                        );
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
            {renderTaskExtraFields()}
            {/* <ExtraFields
                extraFieldsToggler={extraFieldsToggler}
                taskObj={getSelectedTaskObj()}
                visible={true}
                task={getTaskTitle()}></ExtraFields> */}
        </View >
    )
}

const ExtraFields = ({ taskObj, extraFieldsToggler, task }) => {


    const [modalVisible, toggleModalVisible] = useState(true)

    useEffect(() => {
        toggleModalVisible(true)
        helpers.print("___mount extra", "lol")

        return function cleanup() {
            helpers.print("___unmount extra")
        }
    }, [taskObj, task])
    const renderTaskExtraFields = () => {
        if (taskObj === false) return
        if ('fields' in taskObj) {
            const taskExtraFields = taskObj['fields']
            if (!taskExtraFields) return
            const extraFields = taskExtraFields.map((field, index) => {
                const { type } = field
                // console.log("TYPE", type, field)
                switch (type) {
                    case 'fs_multi_select_list_with_search':
                        return (
                            <RnFirebaseMultiSelectList
                                toggleModalVisible={toggleModalVisible}
                                modalVisible={modalVisible}
                                toggleOutput={extraFieldsToggler}
                                key={index} {...field}></RnFirebaseMultiSelectList>
                        )
                        break;
                    case 'modal_list_with_add':
                        return (
                            <ModalList
                                toggleModalVisible={toggleModalVisible}
                                modalVisible={modalVisible}
                                task={task}
                                toggleOutput={extraFieldsToggler}
                                key={index}
                                fireBaseRef={[
                                    { type: 'collection', value: configs.taskCollection },
                                    { type: 'document', value: taskObj.id }
                                ]}
                                {...field}></ModalList>
                        );
                        break;
                }
            });
            return (<>{extraFields}</>)
        } else {
            return (<Title>NO FIELDS</Title>)
        }
    }
    return (
        <>{renderTaskExtraFields()}</>
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