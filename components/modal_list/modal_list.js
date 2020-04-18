import React, { useState, useEffect } from 'react';
import { Portal, Title, Button, Caption, Dialog, Text, Subheading } from 'react-native-paper'
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
export const ModalList = ({ type, title, name, keys, collection, fireBaseRef, extraFieldsObj, toggleExtraFieldsObj }) => {

    const [items, setItems] = useState([])
    const [selectedItem, toggleSelectedItem] = useState(undefined);
    const ref = getFirebaseRef([...fireBaseRef, { type: 'collection', value: collection.toString() }])
    // const ref = firestore().collection(collection);
    const [modalVisible, toggleModalVisible] = useState(true)

    useEffect(() => {
        const subcriber = ref.onSnapshot(querySnapShot => {
            const listItems = []
            querySnapShot.forEach(doc => {
                console.log(doc.data())
                listItems.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            setItems(listItems)
        })

        return function cleanup() {
            subcriber()
        }
    }, [selectedItem])

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


    return (
        <>
            {(selectedItem !== '' && selectedItem !== undefined) && (
                <FlexContainer direction="row" alignItems="center">
                    <Subheading>{title}: </Subheading>
                    <Button mode="contained" uppercase={false} compact>{getItemValueBasedOnKeys()}</Button>
                </FlexContainer>
            )}
            <Portal>
                <Dialog visible={modalVisible} onDismiss={() => toggleModalVisible(false)}>
                    <Dialog.Title>Choose a {title}</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView contentContainerStyle={{ ...styles.buttonContainer, marginTop: 10 }}>
                            {renderOptions()}
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button style={{ marginRight: 10 }} onPress={() => toggleModalVisible(false)}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    )
}