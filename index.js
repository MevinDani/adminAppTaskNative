/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Home from './components/Home';
import MainApp from './MainApp';
import { PaperProvider } from 'react-native-paper';
import ProjectList from './components/ProjectList';
import NewProject from './components/NewProject';
import TaskDetails from './components/TaskDetails';
import TaskStatisticsChart from './components/TaskStatisticsChart';
import TaskStatisticsKit from './components/TaskStatisticsKit';
import StackedBarChartWithOnPressExample from './components/Test';
import CompletedTasks from './components/CompletedTasks';

// import firebase from 'firebase/app'; // Import Firebase
// import 'firebase/database'; // Import Firebase Database module
// import config from './fireBaseConfig' // Import Firebase configuration

// console.log(config)

import database from '@react-native-firebase/database';

// Access and log data from your Firebase Realtime Database
database()
    .ref('/') // Reference to the root of your database
    .once('value') // Fetch the data once
    .then(snapshot => {
        console.log('Data:', snapshot.val());
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


// Initialize Firebase
// if (!firebase.apps.length) {
//     firebase.initializeApp(config);
// }


// export default function Main() {
//     return (
//         <PaperProvider>
//             <MainApp />
//         </PaperProvider>
//     );
// }

AppRegistry.registerComponent(appName, () => MainApp);
