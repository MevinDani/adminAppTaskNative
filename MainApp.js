import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useRef, useState } from 'react'
import Home from './components/Home';
import TaskDetails from './components/TaskDetails';
import Login from './components/Login';
import MachineValidation from './components/MachineValidation';
import CompletedTasks from './components/CompletedTasks';
// import { createDrawerNavigator } from '@react-navigation/drawer';

import AsyncStorage from '@react-native-async-storage/async-storage';


import messaging from '@react-native-firebase/messaging';
import { Alert, AppState } from 'react-native';
import notifee from '@notifee/react-native';
import { Android } from '@notifee/react-native';
import { PermissionsAndroid } from 'react-native';



const Stack = createNativeStackNavigator();

// const Drawer = createDrawerNavigator()

const MainApp = () => {

    const [userDataExists, setUserDataExists] = useState(false);
    const [fcmToken, setFcmToken] = useState(null);

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }

    // Define a navigation reference using useRef
    const navigationRef = useRef(null);


    // Handle notification click event
    // messaging().onNotificationOpenedApp((remoteMessage) => {
    //     console.log('Handle notification click event', remoteMessage);
    //     // Navigate to TaskDetails when notification is clicked
    //     navigationRef.current?.navigate('CompletedTasks');
    // });

    // Handle foreground message
    // messaging().onMessage(async (remoteMessage) => {
    //     console.log('Foreground message received:', remoteMessage);
    //     // Alert.alert('Updated Data', JSON.stringify(remoteMessage));

    //     try {
    //         // Display in-app notification using Notifee
    //         const notification = await notifee.displayNotification({
    //             title: remoteMessage.notification.title,
    //             body: remoteMessage.notification.body,
    //             // android: {
    //             //     priority: notifee.Android.Priority.HIGH, // Set the priority
    //             // },
    //         });

    //         // notification()

    //         // Log the notification ID for debugging
    //         console.log('Displayed notification:', notification.id);
    //     } catch (error) {
    //         console.error('Error displaying notification:', error);
    //     }
    // });



    useEffect(() => {
        // Function to retrieve FCM token
        const retrieveFcmToken = async () => {
            try {
                const token = await messaging().getToken();
                setFcmToken(token);
                // Save the token to AsyncStorage
                await AsyncStorage.setItem('fcmToken', token);
            } catch (error) {
                console.error('Error retrieving FCM token:', error);
            }
        };

        // Call the function to retrieve FCM token
        retrieveFcmToken();

        // Add listener to refresh FCM token if it changes
        const unsubscribe = messaging().onTokenRefresh(retrieveFcmToken);

        // Clean up subscription when component unmounts
        return unsubscribe;
    }, []);


    // const getToken = async () => {
    //     const token = await messaging.getToken()
    //     console.log('token', token)
    // }

    useEffect(() => {
        requestUserPermission()
        // getToken()
    }, [])

    console.log('fcmTokenAdmin', fcmToken)

    // Function to handle FCM messages when the app is in the background or terminated
    // const handleBackgroundMessage = async (remoteMessage) => {
    //     console.log('Message handled in the background!', remoteMessage);
    //     // You can perform any necessary processing here, such as navigating to a specific screen
    //     // Example: navigate to CompletedTasksPage
    //     navigationRef.current?.navigate('CompletedTasks');
    // };

    // Function to handle navigation to TaskDetails
    const navigateToTaskDetails = (data) => {
        navigationRef.current?.navigate('TaskDetails', {
            task_id: data.task_id,
            created_on: data.created_on,
            task_scheduledon: data.task_scheduledon,
            openChat: true
        });
    };

    // Configure messaging event handler
    messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('Handle notification click event', remoteMessage);
        // Check if the notification contains data
        if (remoteMessage.data && remoteMessage.data.task_id) {
            // Extract the task details from the notification data
            const taskData = {
                task_id: remoteMessage.data.task_id,
                created_on: remoteMessage.data.created_on,
                task_scheduledon: remoteMessage.data.task_scheduledon
            };
            // Navigate to TaskDetails screen with the task details
            navigateToTaskDetails(taskData);
        }
    });

    // Function to handle FCM messages when the app is in the background or terminated
    const handleBackgroundMessage = async (remoteMessage) => {
        console.log('Message handled in the background!', remoteMessage);
        // Check if the notification contains data
        if (remoteMessage.data && remoteMessage.data.task_id) {
            // Extract the task details from the notification data
            const taskData = {
                task_id: remoteMessage.data.task_id,
                created_on: remoteMessage.data.created_on,
                task_scheduledon: remoteMessage.data.task_scheduledon
            };
            // Navigate to TaskDetails screen with the task details
            navigateToTaskDetails(taskData);
        }
    };

    // messaging().onMessage(handleBackgroundMessage);


    // Set up background message handler
    messaging().setBackgroundMessageHandler(handleBackgroundMessage);

    // kill state
    messaging().getInitialNotification(handleBackgroundMessage)

    // const setupNotificationChannels = async () => {
    //     try {
    //         await notifee.createChannel({
    //             id: 'your_channel_id',
    //             name: 'Channel Name',
    //             importance: notifee.Importance.HIGH,
    //         });
    //     } catch (error) {
    //         console.error('Error setting up notification channel:', error);
    //     }
    // };

    // // Call the function to set up notification channels
    // setupNotificationChannels();

    // const requestNotificationPermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.RECEIVE_NOTIFICATIONS,
    //             {
    //                 title: 'Notification Permission',
    //                 message: 'Allow app to receive notifications?',
    //                 buttonNeutral: 'Ask Me Later',
    //                 buttonNegative: 'Cancel',
    //                 buttonPositive: 'OK',
    //             }
    //         );
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             console.log('Notification permission granted');
    //         } else {
    //             console.log('Notification permission denied');
    //         }
    //     } catch (error) {
    //         console.error('Error requesting notification permission:', error);
    //     }
    // };

    // // Call the function to request notification permission
    // requestNotificationPermission();



    // useEffect(() => {
    //     const checkUserData = async () => {
    //         try {
    //             const userDataJson = await AsyncStorage.getItem('userData');
    //             const userData = JSON.parse(userDataJson);
    //             setUserDataExists(userData !== null);
    //         } catch (error) {
    //             console.error('Error checking user data:', error);
    //         }
    //     };
    //     checkUserData();
    // }, []);

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>

                <Stack.Screen name='MachineValidation' component={MachineValidation} options={{ headerShown: false }} />
                <Stack.Screen name='LoginPage' component={Login} options={{ headerShown: false }} />
                <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
                <Stack.Screen name='TaskDetails' component={TaskDetails} options={{ headerShown: false }} />
                <Stack.Screen name='CompletedTasks' component={CompletedTasks} options={{ headerShown: false }} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainApp