import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from 'react-native-paper'

import { screen_configs } from './screen_configs.js'

import { TaskListScreen, AddTaskScreen } from './screens'

const Stack = createStackNavigator();
export const AppContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={screen_configs.TaskListScreen.name}
          component={TaskListScreen}
          options={{
            title: screen_configs.TaskListScreen.title,
            ...defaultStyle
          }}
        />
        <Stack.Screen
          name={screen_configs.AddTaskScreen.name}
          component={AddTaskScreen}
          options={{
            title: screen_configs.AddTaskScreen.title,
            ...defaultStyle
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

const defaultStyle = {
  headerStyle: {
    backgroundColor: Colors.blue500,
  },
  headerTintColor: Colors.white
}
