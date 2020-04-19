import React, { useState, useEffect } from 'react';
import { Portal, Title, Button, Caption, Dialog, Text, Subheading, TextInput } from 'react-native-paper'
import { View, ScrollView, StyleSheet } from 'react-native';
import { TimeInputControl, FlexContainer, FlexItem } from '../../theme'
import { theme_file } from '../../theme_file';
import firestore from '@react-native-firebase/firestore'

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

const getFirebaseRef = (fsRef = []) => {
    let ref = firestore()
    if (fsRef.length > 0) {
        fsRef.forEach(_ref => {
            if (_ref.type === 'collection') {
                ref = ref.collection(_ref.value)
            } else if (_ref.type === 'document') {
                ref = ref.doc(_ref.value)
            }
        });
        return ref
    } else {
        throw "failed to get firebase ref"
    }
}

/*
    fireBaseRef: we use this to determine the starting reference for firebase. this is because we can
    keep nesting collections within documents... collection > document > collection > document > so on...

    fireBaseRef={[
        { type: 'collection', value: "task_type" },
        { type: 'document', value: "doc1234" }
    ]}
*/
export const ModalList = ({ type, title, name, keys, collection, add_fields, fireBaseRef, toggleOutput }) => {

    const [items, setItems] = useState([])
    const [selectedItem, toggleSelectedItem] = useState(undefined);
    const ref = getFirebaseRef([...fireBaseRef, { type: 'collection', value: collection.toString() }])
    const [modalVisible, toggleModalVisible] = useState(true)
    const [screenState, toggleScreenState] = useState('list') //list, add

    useEffect(() => {
        updateExtraFieldsValues()
        const subcriber = ref.onSnapshot(querySnapShot => {
            const listItems = []
            querySnapShot.forEach(doc => {
                listItems.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            setItems(listItems)
        })

        return function cleanup() {
            updateExtraFieldsValues("empty") // We update the extraFields obj with empty values
            subcriber()
        }
    }, [selectedItem])

    /* 
        Update extra fields based on selectedItems or input value
        we use an input value parameter because we use this function
        when the component unmounts, when the component un mounts we want
        to basically pass back empty fields to the extraFieldsValue obj
        which is used in the parent element.
    */
    const updateExtraFieldsValues = (value) => {
        _value = (value === "empty") ? undefined : selectedItem
        toggleOutput({ [name]: (!_value) ? undefined : _value })
    }


    // gets which keys to grab from items via the keys props
    const getItemValueBasedOnKeys = (itemId) => {
        const key = keys[0]; // TODO: we only use 1 key to keep things simple, but ideally in the future, 
        //we might want to be able a few more

        let _selectedItemId = (!itemId) ? selectedItem : itemId
        const itemObj = items.find(item => item.id === _selectedItemId)
        return itemObj[key]
    }

    const selectItem = (itemName) => {
        toggleSelectedItem(itemName)
    }

    const renderOptions = () => {
        if (items.length < 0) return (<Text>No {title}s</Text>)

        return items.map((option, i) => {
            return (
                <Button
                    key={i}
                    mode={(selectedItem === option.id) ? "contained" : "outlined"}
                    compact
                    color={(selectedItem === option.id) ? theme_file.colors.primary : theme_file.colors.text}
                    uppercase={false}
                    style={styles.button}
                    onPress={() => selectItem(option.id)}>
                    {getItemValueBasedOnKeys(option.id)}
                </Button>
            )
        })
    }

    const renderListModal = () => {
        return (
            <Dialog visible={modalVisible} onDismiss={() => toggleModalVisible(false)}>
                <Dialog.Title>Choose a {title}</Dialog.Title>
                <Dialog.ScrollArea>
                    <ScrollView contentContainerStyle={{ ...styles.buttonContainer, marginTop: 10, marginBottom: 10 }}>
                        {renderOptions()}
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <FlexContainer direction="row" justifyContent="flex-start">
                        <FlexItem>
                            <Button style={{ left: 0 }} onPress={() => toggleScreenState('add')}>Add New</Button>
                        </FlexItem>
                        <FlexItem>
                            <Button style={{ marginRight: 10 }} onPress={() => toggleModalVisible(false)}>Ok</Button>
                        </FlexItem>
                    </FlexContainer>
                </Dialog.Actions>
            </Dialog>
        )
    }

    const renderModal = () => {
        switch (screenState) {
            case 'list':
                return (<>{renderListModal()}</>)
                break;
            case 'add':
                return (
                    <AddNewOptions
                        addFields={add_fields}
                        fireBaseRef={ref}
                        toggleScreenState={toggleScreenState}
                        modalVisible={modalVisible}
                        toggleModalVisible={toggleModalVisible}
                        title={title} />
                )

            default:
                return (<>{renderListModal()}</>)
                break;
        }
    }


    return (
        <>
            {(selectedItem !== '' && selectedItem !== undefined) && (
                <FlexContainer direction="row" alignItems="center">
                    <Subheading>{title}: </Subheading>
                    <Button mode="contained" uppercase={false} compact>{getItemValueBasedOnKeys()}</Button>
                </FlexContainer>
            )}
            <Portal>
                {renderModal()}
            </Portal>
        </>
    )
}


const AddNewOptions = ({ addFields, fireBaseRef, toggleScreenState, toggleModalVisible, modalVisible, title }) => {

    const [values, toggleValues] = useState({})

    const addToFireStore = () => {
        if ('id' in values && values['id'] !== undefined) {
            console.log("HAD ID", values.id)
            return fireBaseRef
                .doc(values.id)
                .set(values)
                .then(() => {
                    alert("Added")
                    toggleScreenState('list')
                })
        } else {
            console.log("NO ID")
            return fireBaseRef
                .add(values)
                .then(() => {
                    alert("Added")
                    toggleScreenState('list')
                })
        }
    }

    const toggleValue = (value) => {
        console.log(value)
        toggleValues({ ...values, ...value });
    }

    const renderedFields = () => addFields.map((item, index) => {
        return (
            <View key={index}>
                <Caption>{item.key}</Caption>
                <TextInput
                    value={values[item.key]}
                    dense
                    style={{ minWidth: '100%' }}
                    onChangeText={text => toggleValue({ [item.key]: text })}
                />
            </View>
        )
    })

    const validatIdField = (value) => {
        let _value = value.toLowerCase()
        _value = _value.replace(" ", "_")
        return _value;
    }

    const renderIdField = () => {
        return (
            <View key="id-optional">
                <Caption>id (optional)</Caption>
                <TextInput
                    value={values['id']}
                    dense
                    style={{ minWidth: '100%' }}
                    onChangeText={text => toggleValue({ ['id']: validatIdField(text) })}
                    autoCapitalize="none"
                />
            </View>
        )
    }

    if (!addFields) return (<Text>No Add Fields</Text>);

    return (
        <Dialog visible={modalVisible} onDismiss={() => toggleModalVisible(false)}>
            <Dialog.Title>Add a {title}</Dialog.Title>
            <Dialog.ScrollArea>
                <ScrollView contentContainerStyle={{ ...styles.buttonContainer, marginTop: 10, marginBottom: 10 }}>
                    {renderIdField()}
                    {renderedFields()}
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <FlexContainer direction="row" justifyContent="flex-start">
                    <FlexItem>
                        <Button style={{ left: 0 }} onPress={() => toggleScreenState('list')}>Back</Button>
                    </FlexItem>
                    <FlexItem>
                        <Button style={{ marginRight: 10 }} onPress={() => addToFireStore()}>Add</Button>
                    </FlexItem>
                </FlexContainer>
            </Dialog.Actions>
        </Dialog>
    )
}