/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import Todos from './Todos'

import { name as appName } from './app.json';
import firestore from '@react-native-firebase/firestore'

firestore().settings({
    persistence: true,
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED
}).then(() => console.log("firestore settings set to unlimited cache size"))

AppRegistry.registerComponent(appName, () => Todos);
