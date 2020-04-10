import React, { useState } from 'react';
import { TextInput, IconButton, Button } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker';
import { FlexItem, FlexContainer, Gutter } from '../index';
import moment from 'moment'

export const TimeInputControl = ({
    datetime,
    toggleDateTime,
    minWidth = 150,
    showCommonTimes = false,
    showIncrementDecrement = true
}) => {

    if (!datetime || datetime == '') datetime = new Date()

    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || datetime;
        setShow(Platform.OS === 'ios');
        toggleDateTime(currentDate);
    }

    return (
        <>
            <FlexContainer direction="row" alignItems="center">
                <FlexItem>
                    <TextInput
                        value={datetime.toLocaleTimeString()}
                        dense
                        style={{ minWidth: minWidth }} />
                </FlexItem>
                <FlexItem margin={{ marginLeft: 5, marginRight: 5 }}>
                    <Button icon="pencil" onPress={() => setShow(true)} compact mode="contained"></Button>
                </FlexItem>
                {showCommonTimes && (
                    <CommonTimes />
                )}
                {showIncrementDecrement && (
                    <IncrementDecrement />
                )}
            </FlexContainer>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={datetime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </>

    )
}

const IncrementDecrement = ({ toggleTime }) => {
    return (
        <FlexContainer direction="row">
            <FlexItem grow={false} margin={{ marginLeft: 5, marginRight: 5 }}>
                <Button icon="plus" uppercase={false} mode="contained" compact>5m</Button>
            </FlexItem>
            <FlexItem grow={false} margin={{ marginLeft: 5, marginRight: 5 }}>
                <Button icon="minus" uppercase={false} mode="contained" compact>5m</Button>
            </FlexItem>
        </FlexContainer>
    )
}

const CommonTimes = () => {
    const commonTimes = [
        {
            name: "now",
            title: "now"
        },
        {
            name: "now-5m",
            title: "now-5m",
        }
    ]
    const commonTimesRender = commonTimes.map((item, index) => {
        return (
            <FlexItem key={index} grow={false}>
                <Gutter>
                    <Button uppercase={false} mode="contained" compact>{item.title}</Button>
                </Gutter>
            </FlexItem>
        )
    })
    return (
        <FlexContainer direction="row" wrap="wrap">
            {commonTimesRender}
        </FlexContainer>
    )
}