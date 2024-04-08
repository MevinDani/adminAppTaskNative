/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Home from './components/Home';
import MainApp from './MainApp';
import ProjectList from './components/ProjectList';
import NewProject from './components/NewProject';
import TaskDetails from './components/TaskDetails';
import TaskStatisticsChart from './components/TaskStatisticsChart';
import TaskStatisticsKit from './components/TaskStatisticsKit';

AppRegistry.registerComponent(appName, () => TaskStatisticsChart);
