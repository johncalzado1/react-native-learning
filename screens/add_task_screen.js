import React, { useState, useEffect } from 'react';
import { Text, Portal, Divider, Title, Button, Caption, TextInput, IconButton } from 'react-native-paper'
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
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
        <Portal.Host>
            <ScrollView style={{ margin: 10 }}>
                <CategorySection />
                <TimeSection />
            </ScrollView>
        </Portal.Host>
    )
}

const CategorySection = () => {
    const [taskTypes, setTaskTypes] = useState([])
    const [loading, setLoading] = useState(true);
    const ref = firestore().collection('task_type');

    useEffect(() => {
        return ref.onSnapshot((querySnapshot) => {
            const list = [];
            querySnapshot.forEach(doc => {
                const { name, title } = doc.data();
                list.push({
                    id: doc.id,
                    title,
                    name,
                });
            });

            setTaskTypes(list);

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
                    mode="outlined"
                    compact
                    color={theme_file.colors.text}
                    uppercase={false}
                    style={styles.button}>
                    {option.title}
                </Button>
            )
        })
    }
    return (
        <View>
            <Title>Task</Title>
            <View style={styles.buttonContainer}>
                {renderOptions()}
            </View>
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