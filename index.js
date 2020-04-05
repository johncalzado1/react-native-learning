/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import Todos from './Todos'
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Todos);
