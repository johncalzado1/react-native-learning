import React, { useState } from 'react';
import { Text, Portal, Divider, Title, Button } from 'react-native-paper'
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'

export const AddTaskScreen = () => {
    return (
        <Portal.Host>
            <ScrollView style={{ margin: 10 }}>
                <CategorySection />
                <TimeSection />
            </ScrollView>
        </Portal.Host>
    )
}

const CategorySection = () => {
    const options = [
        { name: 'Free Time' },
        { name: 'Work' },
        { name: 'Projects' },
        { name: 'Food' },
        { name: 'Shower' }
    ]
    const renderOptions = () => {
        return options.map((option, i) => {
            return (
                <Button
                    key={i}
                    mode="outlined"
                    compact
                    uppercase={false}
                    style={styles.button}>
                    {option.name}
                </Button>
            )
        })
    }
    return (
        <>
            <Title>Task</Title>
            <View style={styles.buttonContainer}>
                {renderOptions()}
            </View>
        </>
    )
}

const TimeSection = () => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showTimepicker = () => {
        setShow(true)
    };

    return (
        <View>
            <View>
                <Button onPress={showTimepicker}>Show time picker!</Button>
            </View>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={date}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        margin: 5
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    }
});