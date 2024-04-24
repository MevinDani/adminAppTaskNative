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
import Screen from './components/notifeeTest';


// import firebase from 'firebase/app'; // Import Firebase
// import 'firebase/database'; // Import Firebase Database module
// import config from './fireBaseConfig' // Import Firebase configuration

// console.log(config)

import database from '@react-native-firebase/database';
import { Alert } from 'react-native';
// import notifee from '@notifee/react-native';


// Access data from your Firebase Realtime Database and display it in an alert whenever it updates
database()
    .ref('userLocations') // Reference to the root of your database
    .on('value', snapshot => {
        const data = snapshot.val();
        // Alert.alert('Updated Data', JSON.stringify(data));
        // console.log('databaseData', data)
        // notifee.displayNotification({
        //     title: 'Updated Data',
        //     body: JSON.stringify(data), // Convert data to string for body
        // });
    }, error => {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data. Please try again later.');
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
