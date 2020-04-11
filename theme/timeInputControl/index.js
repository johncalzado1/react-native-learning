import React, { useState } from 'react';
import { TextInput, IconButton, Button } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker';
import { FlexItem, FlexContainer, Gutter } from '../index';
import moment from 'moment'
import { StyleSheet } from 'react-native';
import { theme_file } from '../../theme_file'

const styles = StyleSheet.create({
    item: {
        marginRight: 10,
        marginBottom: 10
    }
});

export const TimeInputControl = ({
    datetime,
    toggleDateTime,
    minWidth = 100,
    showCommonTimes = false,
    showIncrementDecrement = true
}) => {

    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || datetime;
        setShow(Platform.OS === 'ios');
        toggleDateTime(currentDate);
    }

    return (
        <>
            <FlexContainer direction="row" alignItems="center" wrap="wrap">
                <FlexItem>
                    <TextInput
                        disabled
                        value={(datetime instanceof Date) ? moment(datetime).format("HH:mm") : ''}
                        dense
                        style={{ ...styles.item, minWidth: minWidth }} />
                </FlexItem>
                <FlexItem>
                    <IconButton
                        icon="pencil"
                        style={styles.item}
                        onPress={() => setShow(true)}></IconButton>
                </FlexItem>
                {showIncrementDecrement && (
                    <IncrementDecrement toggleTime={toggleDateTime} datetime={datetime} />
                )}
                {showCommonTimes && (
                    <CommonTimes toggleDateTime={toggleDateTime} />
                )}
                <FlexItem>
                    <IconButton
                        icon="close"
                        style={styles.item}
                        onPress={() => toggleDateTime(undefined)}></IconButton>
                </FlexItem>
            </FlexContainer>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={(datetime instanceof Date) ? datetime : new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </>

    )
}

const IncrementDecrement = ({ datetime, toggleTime }) => {
    const _datetime = (datetime instanceof Date) ? datetime : new Date()
    return (
        <>
            <FlexItem grow={false}>
                <IconButton
                    icon="plus"
                    style={styles.item}
                    onPress={() => toggleTime(moment(_datetime).add(1, "minute").toDate())}></IconButton>
            </FlexItem>
            <FlexItem grow={false}>
                <IconButton
                    icon="minus"
                    style={styles.item}
                    onPress={() => toggleTime(moment(_datetime).subtract(1, "minute").toDate())}></IconButton>
            </FlexItem>
        </>
    )
}

const CommonTimes = ({ toggleDateTime }) => {
    const commonTimes = [
        {
            name: "now",
            title: "now",
            action: (toggleDateTime) => {
                toggleDateTime(new Date())
            }
        }
    ]
    const commonTimesRender = commonTimes.map((item, index) => {
        return (
            <FlexItem key={index} grow={false}>
                <Button
                    uppercase={false}
                    mode="text"
                    compact
                    style={styles.item}
                    color={theme_file.colors.text}
                    onPress={() => item.action(toggleDateTime)}>{item.title}</Button>
            </FlexItem>
        )
    })
    return (
        <>
            {commonTimesRender}
        </>
    )
}