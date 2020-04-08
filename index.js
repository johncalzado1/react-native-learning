/**
 * @format
 */
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import firestore from '@react-native-firebase/firestore'

import { AppContainer } from './app_container'

// Set firestore databse persistence
firestore().settings({
    persistence: true,
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED
}).then(() => console.log("firestore settings set to unlimited cache size"))

AppRegistry.registerComponent(appName, () => AppContainer);
