import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Text, Title, Searchbar, List, Portal, Dialog, Button, Chip, Caption } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore';
import { FlexContainer, FlexItem } from '../../theme/flex_layout'
import { helpers } from '../../helpers'

const styles = StyleSheet.create({
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    button: {
        marginBottom: 10,
        marginRight: 10
    }
});

export const RnFirebaseMultiSelectList = ({ type, title, collection, name, keys, search_key, extraFieldsObj, toggleExtraFieldsObj }) => {

    const [ok, toggleOk] = useState([])
    const [items, setItems] = useState([])
    const [filteredItems, setFilteredItems] = useState([])
    const [selectedItems, toggleSelectedItems] = useState([]) // initialise selectedItems
    const [searchVal, setSearchVal] = useState('')
    const [showSearchModal, toggleShowSearchModal] = useState(false)

    const ref = firestore().collection(collection);

    useEffect(() => {
        return ref.onSnapshot(querySnapShot => {
            const listItems = []
            querySnapShot.forEach(doc => {
                listItems.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            setItems(listItems)
            setFilteredItems(listItems)
        })
    }, [])

    const searchFilterFunction = text => {
        setSearchVal(text)
        const newData = items.filter(item => {
            const itemData = `${item[search_key].toUpperCase()}`;
            const textData = text.toUpperCase();
            // console.log(item, search_key, itemData, textData, itemData.indexOf(textData) > -1)
            return itemData.indexOf(textData) > -1;
        });
        // console.log(newData)
        setFilteredItems(newData)
    };

    const renderListHeader = () => {
        return (
            <>
                <Searchbar
                    placeholder="Search"
                    onChangeText={text => searchFilterFunction(text)}
                    value={searchVal}
                    style={{ marginBottom: 10 }}
                />
                {renderSelectedItems()}
            </>
        )
    }


    const renderSelectedItems = () => {
        const selectedItemsGroup = selectedItems.map((item, index) => {
            const itemObj = helpers.findValueInArrayOfObjs(items, item, 'id')
            return (
                <FlexItem key={index}>
                    <Chip icon="close" style={styles.button} onPress={() => removeFromSelectedItems(item)}>{itemObj.title}</Chip>
                </FlexItem>
            )
        })
        return (
            <FlexContainer direction="row" wrap="wrap">
                {selectedItemsGroup}
            </FlexContainer>
        )
    }

    const removeFromSelectedItems = (itemName) => {
        const itemIndex = selectedItems.indexOf(itemName)
        if (itemIndex > -1) {
            const _selectedItems = selectedItems.map(item => item);
            _selectedItems.splice(itemIndex, 1)
            toggleSelectedItems(_selectedItems)
        }
    }

    const appendToListOfSelectedItems = (itemName) => {
        // console.log(itemName)
        if (selectedItems.indexOf(itemName) === -1) {
            const _selectedItems = selectedItems.map(item => item);
            _selectedItems.push(itemName)
            toggleSelectedItems(_selectedItems)
        }
    }

    console.log("re-render")

    return (
        <>
            <Title>{title}</Title>
            {renderSelectedItems()}
            <Button compact mode="outlined" icon="plus" onPress={() => toggleShowSearchModal(true)}>add food</Button>
            <Portal>
                <Dialog visible={showSearchModal} onDismiss={() => toggleShowSearchModal(false)}>
                    <Dialog.Title>Choose food(s)</Dialog.Title>
                    <Dialog.ScrollArea style={{ minHeight: 400, borderTopWidth: 0 }}>
                        <FlatList
                            data={filteredItems}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <List.Item title={item.title} onPress={() => appendToListOfSelectedItems(item.id)} />}
                            ListHeaderComponent={renderListHeader()}
                        />
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => toggleShowSearchModal(false)}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    )
}