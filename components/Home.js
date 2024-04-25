import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator, Modal, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from './Header'
import dayjs from 'dayjs';
import TaskOpen from '../images/task_open.png'
import Triangle from '../images/triangle_in_path.png'
import TaskHold from '../images/task_end_in_path.png'
import TaskEscalated from '../images/escalated.png'
import TravelStart from '../images/travel_start_in_path.png'
import TravelEnd from '../images/travel_end_in_path.png'
import TaskStart from '../images/task_start_in_path.png'
import TaskEnd from '../images/task_end.png'
import completed from '../images/ic_check_scanned_button.png'
import beyondScope from '../images/task_end_in_path.png'
import AddNewTask from './AddNewTask';
import TaskStatisticsChart from './TaskStatisticsChart';
import ProjectList from './ProjectList';
import NewProject from './NewProject';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastManager, { Toast } from 'toastify-react-native'
import TaskFilterPop from './TaskFilterPop';


// import database from '@react-native-firebase/database';
// import { Alert } from 'react-native';
// import notifee from '@notifee/react-native';

import messaging from '@react-native-firebase/messaging';
import EmpLocation from './EmpLocation';

import location from '../images/globeLoc.png'
import database from '@react-native-firebase/database';
import { Alert } from 'react-native';

import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, PROVIDER_OSMDROID } from 'react-native-maps';
import mapMan from '../images/mapMan.png'
import mapManS from '../images/mapManS.png'



// // Access data from your Firebase Realtime Database and display it in an alert whenever it updates
// database()
//     .ref('/') // Reference to the root of your database
//     .on('value', snapshot => {
//         const data = snapshot.val();
//         Alert.alert('Updated Data', JSON.stringify(data));
//         console.log(data)

//         // async function onDisplayNotification() {

//         //     console.log('inside displayNot')

//         //     // Create a channel (required for Android)
//         //     const channelId = await notifee.createChannel({
//         //         id: 'default',
//         //         name: 'Default Channel',
//         //     });

//         //     // Display a notification
//         //     await notifee.displayNotification({
//         //         title: 'Notification Title',
//         //         body: JSON.stringify(data),
//         //         android: {
//         //             channelId,
//         //             smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
//         //             // pressAction is needed if you want the notification to open the app when pressed
//         //             pressAction: {
//         //                 id: 'default',
//         //             },
//         //         },
//         //     });
//         // }

//         // onDisplayNotification()
//         notifee.displayNotification({
//             title: 'Updated Data',
//             body: JSON.stringify(data), // Convert data to string for body
//         });
//     }, error => {
//         console.error('Error fetching data:', error);
//         Alert.alert('Error', 'Failed to fetch data. Please try again later.');
//     });


const Home = () => {

    const [fcmToken, setFcmToken] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [messageData, setMessageData] = useState(null);



    const [showMap, setShowMap] = useState(false)

    console.log('showMap', showMap)

    useEffect(() => {
        // Function to retrieve FCM token
        const retrieveFcmToken = async () => {
            try {
                const token = await messaging().getToken();
                setFcmToken(token);

                if (token) {

                }
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


    console.log('fcmTokenFromHome', fcmToken)

    // useEffect(() => {
    //     const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    //         // When a foreground message is received, set the message data and show the modal
    //         setMessageData(remoteMessage.data);
    //         setModalVisible(true);
    //     });

    //     return unsubscribe;
    // }, []);

    // const closeModal = () => {
    //     // Close the modal
    //     setModalVisible(false);
    // };



    const [msgModal, setmsgModal] = useState(false);

    const [newTaskModal, setNewTaskModal] = useState(false);

    // const [messageData, setMessageData] = useState(null);

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {

            console.log(remoteMessage)

            setMessageData(remoteMessage.data);

            if (remoteMessage.notification.title === 'New Message') {
                setmsgModal(true);
            }
            if (remoteMessage.notification.title === 'New Task') {
                setNewTaskModal(true);
            }
            // When a foreground message is received, set the message data and show the modal
        });

        return unsubscribe;
    }, []);

    console.log('messageData', messageData)


    // useEffect(() => {
    //     // Function to retrieve FCM token
    //     const retrieveFcmToken = async () => {
    //         try {
    //             const token = await messaging().getToken();
    //             setFcmToken(token);
    //         } catch (error) {
    //             console.error('Error retrieving FCM token:', error);
    //         }
    //     };

    //     // Call the function to retrieve FCM token
    //     retrieveFcmToken();

    //     // Add listener to refresh FCM token if it changes
    //     const unsubscribe = messaging().onTokenRefresh(retrieveFcmToken);

    //     // Clean up subscription when component unmounts
    //     return unsubscribe;
    // }, []);

    // console.log('fcmToken', fcmToken)

    const navigation = useNavigation()

    const [allTaskData, setAllTaskData] = useState(null)

    const [showNewTask, setShowNewTask] = useState(false)

    const [showProjectList, setShowProjectList] = useState(false)

    const [showNewProject, setShowNewProject] = useState(false)

    const [showTaskFilter, setShowTaskFilter] = useState(false)

    const [userData, setUserData] = useState(null)

    const [empId, setEmpId] = useState('')

    const [showActivity, setShowActivity] = useState(false)

    const [selectedStage, setSelectedStage] = useState('ALL')

    const [taskUrl, setTaskUrl] = useState('')

    const [taskStageList, setTaskStageList] = useState(null)

    const [taskFilterData, setTaskFilterData] = useState(null)

    const [showFilterActivity, setShowFilterActivity] = useState(false)

    // filterstate
    const [status, setStatus] = useState('all')
    const [priority, setPriority] = useState('all')
    const [fromDate, setFromDate] = useState('1900-01-01')
    const [toDate, setToDate] = useState('1900-01-01')
    const [EmpIdF, setEmpIdF] = useState('all')
    const [dept, setDept] = useState('all')
    const [searchTerm, setSearchTerm] = useState('-')

    const [codeValue, setCodeValue] = useState(null);

    const handleTaskFilterClick = (data) => {
        // console.log('taskFilterData', data)
        setTaskFilterData(data)
        // if (data.status !== '') {
        //     setStatus(data.status)
        // }
        if (data.priority !== '') {
            setPriority(data.priority)
        }
        if (data.fromDate !== '') {
            setFromDate(data.fromDate)
        }
        if (data.toDate !== '') {
            setToDate(data.toDate)
        }
        if (data.EmpId !== '') {
            setEmpIdF(data.EmpId)
        }
        if (data.Dept !== '') {
            setDept(data.Dept)
        }
        if (data.searchTerm !== '') {
            setSearchTerm(data.searchTerm)
        }

        if (data.status !== 'all') {
            const foundCode = taskStageList?.find(code => code.code_name === data.status);
            if (foundCode) {
                // Set the code_value state based on the matched code_name
                setCodeValue(foundCode.code_value);
            } else {
                // Handle case where no matching code_name is found
                setCodeValue('all');
            }
        }

        // fetchFilteredTasks()

        // console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/user_name/-/all/all/department_name/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
    }

    useEffect(() => {
        if (status !== 'all') {
            const foundCode = taskStageList.find(code => code.code_name === status);
            if (foundCode) {
                // Set the code_value state based on the matched code_name
                setCodeValue(foundCode.code_value);
            } else {
                // Handle case where no matching code_name is found
                setCodeValue('all');
            }
        }
    }, [status])

    useEffect(() => {
        if (showTaskFilter === true) {
            setStage('all')
        }
    }, [showTaskFilter])

    useEffect(() => {
        fetchFilteredTasks()
    }, [taskFilterData])

    // useEffect(() => {
    //     fetchFilteredTasks()
    //     // if (status !== 'all' || priority !== 'all' || fromDate !== '1900-01-01' || toDate !== '1900-01-01' || EmpIdF !== 'all' || dept !== 'all' || searchTerm !== '-') {
    //     // }
    // }, [status, priority, fromDate, toDate, EmpIdF, dept, searchTerm])

    // console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)

    const fetchFilteredTasks = async () => {
        setShowFilterActivity(true)
        // console.log('taskFilterDataFromFilterApi', taskFilterData)
        const empName = taskFilterData.EmpId !== '' ? taskFilterData.EmpId : 'all';
        const deptName = taskFilterData.Dept !== '' ? taskFilterData.Dept : 'all';
        const fromDate = taskFilterData.fromDate !== '' ? taskFilterData.fromDate : '1900-01-01';
        const toDate = taskFilterData.toDate !== '' ? taskFilterData.toDate : '1900-01-01';
        const searchTerm = taskFilterData.searchTerm !== '' ? taskFilterData.searchTerm : '-';
        const code = taskFilterData.code !== '' ? taskFilterData.code : 'all';
        const priority = taskFilterData.priority !== '' ? taskFilterData.priority : 'all';

        try {
            if (taskUrl === 'SUPERADMIN') {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${empName}/-/all/all/${deptName}/${fromDate}/${toDate}/${searchTerm}/${priority}/${code}`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${empName}/-/all/all/${deptName}/${fromDate}/${toDate}/${searchTerm}/${priority}/${code}`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            } else if (taskUrl === 'COORDINATOR') {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            } else if (taskUrl === 'DEPT_ADMIN') {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            }
        } catch (error) {
            console.log('fetchFilteredTasksErr', error)
        }
    }


    const showUserDataToast = (userData) => {
        if (userData && userData.empid) {
            Toast.success(`Welcome ${userData.empid}`);
        }
    }

    const setStage = (stage) => {
        setSelectedStage(stage)
    }

    useEffect(() => {
        const fetchTasksByStage = async () => {
            setShowFilterActivity(true)
            try {
                if (taskUrl === 'SUPERADMIN') {
                    const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/all/-/all/all/all/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                    if (response.status === 200) {
                        const filteredTasks = response.data.filter(task => task.latest_status === selectedStage);
                        // Do something with the filtered tasks, like set them to state
                        setAllTaskData(filteredTasks);
                        setShowFilterActivity(false)
                    }
                    // } else {
                    //     const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                    //     if (response.status === 200) {
                    //         const filteredTasks = response.data.filter(task => task.latest_status === selectedStage);
                    //         // Do something with the filtered tasks, like set them to state
                    //         setAllTaskData(filteredTasks);
                    //         setShowFilterActivity(false)
                    //     }
                    // }
                } else if (taskUrl === 'COORDINATOR') {
                    console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                    const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                    if (response.status === 200) {
                        const filteredTasks = response.data.filter(task => task.latest_status === selectedStage);
                        // Do something with the filtered tasks, like set them to state
                        setAllTaskData(filteredTasks);
                        setShowFilterActivity(false)
                    }
                } else if (taskUrl === 'DEPT_ADMIN') {
                    console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                    const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                    if (response.status === 200) {
                        const filteredTasks = response.data.filter(task => task.latest_status === selectedStage);
                        // Do something with the filtered tasks, like set them to state
                        setAllTaskData(filteredTasks);
                        setShowFilterActivity(false)
                    }
                }
                // const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`);
                // const filteredTasks = response.data.filter(task => task.latest_status === selectedStage);
                // // Do something with the filtered tasks, like set them to state
                // setAllTaskData(filteredTasks);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (selectedStage === 'ALL') {
            fetchAllTasks();
        } else {
            fetchTasksByStage();
        }
    }, [selectedStage]);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataJson = await AsyncStorage.getItem('userData');
                const userData = JSON.parse(userDataJson);
                // Now you have userData, you can use it here
                setUserData(userData)
                setEmpId(userData.empid)
                console.log(userData, 'userData')
                showUserDataToast(userData)

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);


    useEffect(() => {
        const sendFcmToken = async () => {

            const fmcData = [
                {
                    CMPCODE: "CPAYS",
                    user_id: userData.empid,
                    device_token: fcmToken
                }
            ]

            console.log('fmcData', fmcData)

            try {
                const response = await axios.post(`https://cubixweberp.com:156/api/CRMUserIdDeviceToken`, JSON.stringify(fmcData), {

                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.status === 200) {
                    console.log('fcmSaved', response.data)
                }
            } catch (error) {
                console.error('Error sending FCM token to cbx api from home:', error);
            }
        }
        if (fcmToken && userData) {
            sendFcmToken()
            console.log('sendingFcmCall')
        }
    }, [fcmToken, userData])

    // console.log('userData', userData)

    useEffect(() => {
        if (userData) {
            setTaskUrl(userData.onlineallow)
            // if (userData.onlineallow === 'SUPERADMIN') {
            //     setTaskUrl('SUPERADMIN')
            // } else {
            //     setTaskUrl(`NOTSUPERADMIN`)
            // }
        }

    }, [userData])

    useEffect(() => {
        if (userData && taskUrl !== '') {
            fetchAllTasks()
        }
    }, [userData, taskUrl])

    const hardReset = async () => {
        setShowFilterActivity(true)
        console.log('taskUrl-hardReset', taskUrl)
        try {
            if (taskUrl === 'SUPERADMIN') {
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/all/-/all/all/all/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            } else if (taskUrl === 'COORDINATOR') {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            } else if (taskUrl === 'DEPT_ADMIN') {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            }
        } catch (error) {
            console.log('hardResetErr', error)
        }
    }

    const fetchAllTasks = async () => {
        console.log('taskUrl-fetchAllTasks', taskUrl)
        setShowFilterActivity(true)
        try {
            if (taskUrl === 'SUPERADMIN') {
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/all/-/all/all/all/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            } else if (taskUrl === 'COORDINATOR') {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                // const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/all/-/all/all/all/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)

                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            } else if (taskUrl === 'DEPT_ADMIN') {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            }
        } catch (error) {
            console.log('fetchAllTasksErr', error)
            setShowFilterActivity(false)
        }
    }

    // useEffect(() => {
    //     if (taskUrl !== '') fetchAllTasks()
    // }, [taskUrl])

    useEffect(() => {
        const fetchTaskStageList = async () => {
            try {
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTAskStageList/CPAYS/all/-`)
                if (response.status === 200) {
                    setTaskStageList(response.data)
                }
            } catch (error) {
                console.log('fetchTaskStageError', error)
            }
        }
        fetchTaskStageList()
    }, [])


    // timelineImage
    const getImageForStatus = (status) => {
        switch (status) {
            case 'ACCEPTED_OPEN':
                return TaskOpen
            case 'TRAVEL_START':
                return TravelStart
            case 'TRAVEL_END':
                return TravelEnd
            case 'TASK_START':
                return TaskStart
            case 'TASK_END':
                return TaskEnd
            case 'ESCALATED':
                return TaskEscalated
            case 'ACCEPTED_ON_HOLD':
                return TaskHold
            case 'CUSTOMER_REJECTION':
                return Triangle
            case 'COMPLETED':
                return completed
            case 'BEYOND THE SCOPE':
                return beyondScope
            // Add cases for other statuses as needed
            // default:
            //     return require('../images/default_image.png');
        }
    };

    const gotoTaskDetail = (task) => {
        navigation.navigate('TaskDetails', {
            task_id: task.task_id,
            created_on: task.created_on,
            task_scheduledon: task.task_scheduledon,
            openChat: false
        });
    };


    const showTaskSaveToast = () => {
        Toast.success('Task Added Successfully')
    }

    const navigateToTaskDetails = (data) => {
        setmsgModal(false);
        navigation.navigate('TaskDetails', {
            task_id: data.task_id,
            created_on: data.created_on,
            task_scheduledon: data.task_scheduledon,
            openChat: true
        });
    };

    // empLoc

    const [dbUserLocations, setDbUserLocations] = useState(null)
    const [empIdData, setEmpIdData] = useState(null)
    const [empListLoader, setEmpListLoader] = useState(false)

    const [userLocation, setUserLocation] = useState(null)

    useEffect(() => {
        // Function to fetch initial data from Firebase and set state
        const fetchData = async () => {
            try {
                console.log('setDbUserLocationsfetchData')
                const snapshot = await database().ref('userLocations').once('value');
                const data = snapshot.val();
                setDbUserLocations(data); // Update state with fetched data
            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to fetch data. Please try again later.');
            }
        };

        fetchData(); // Call the function

        console.log('dbUserLocations', dbUserLocations)

        // Subscription to database updates without updating state
        const onDatabaseUpdate = snapshot => {
            const data = snapshot.val();
            console.log('Database data updated:', data);
            setDbUserLocations(data); // Update state with new data
        };

        database().ref('userLocations').on('value', onDatabaseUpdate);

        // Cleanup function to remove event listener when component unmounts
        return () => {
            database().ref('userLocations').off('value', onDatabaseUpdate); // Unsubscribe from updates
        };

    }, []);


    // const [showMap, setShowMap] = useState(false)

    const getEmpData = async () => {
        setEmpListLoader(true)
        try {
            const response = await axios.get(`https://cubixweberp.com:156/api/PersonalInfoList/CPAYS/ALL/YES/ALL/ALL/ALL/ALL`)
            if (response.status === 200) {
                setEmpIdData(response.data)
                setEmpListLoader(false)
            }
        } catch (error) {
            console.log(error)
            setEmpListLoader(false)
        }
    }

    // const handleShowMap = async (empId) => {
    //     setShowMap(true)
    // }

    const handleShowMap = async (empId) => {
        let locationFound = false;

        for (const key in dbUserLocations) {
            if (Object.hasOwnProperty.call(dbUserLocations, key)) {
                // Check if the key matches the empId
                if (key === empId) {
                    // Extract location details for the employee
                    const { latitude, longitude, latitudeDelta, longitudeDelta } = dbUserLocations[key];

                    console.log(`Location details for ${empId}: Latitude ${latitude}, Longitude ${longitude}`);
                    // Update state with the user's location
                    setUserLocation({ latitude, longitude, latitudeDelta, longitudeDelta });
                    locationFound = true;
                    break; // Exit loop once a match is found
                }
            }
        }

        // If location not found, set state to null
        if (!locationFound) {
            console.log('noKeyFound')
            setUserLocation(null);
        }

        // Show the map
        setShowMap(true);
    };

    console.log('userLocation', userLocation)



    useEffect(() => {
        getEmpData()
    }, [])
    // empLoc



    // console.log('allTaskData', allTaskData)

    console.log('messageData', messageData)
    return (
        <SafeAreaView style={styles.HomeContainer}>
            <ToastManager />

            <ScrollView scrollEnabled={!showMap}>

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    {/* header */}
                    <Header />
                    {/* header */}

                    {/* projectTask */}
                    <View style={{
                        flexDirection: "row",
                        justifyContent: 'center',
                        marginVertical: 4,
                        backgroundColor: '#E6E6FA',
                        width: '100%',
                        paddingHorizontal: 8,
                        paddingVertical: 12
                    }}>
                        <TouchableOpacity style={styles.projectTask} onPress={() => setShowNewTask(!showNewTask)}>
                            <View style={{
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Image style={styles.projectImg} source={require('../images/addNewTaskIcon.png')}></Image>
                                <Text style={{ color: 'black', marginTop: 8, fontWeight: 'bold' }}>New Task</Text>
                            </View>
                        </TouchableOpacity >
                        <TouchableOpacity style={styles.projectTask} onPress={() => setShowNewProject(!showNewProject)}>
                            <View style={{
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Image style={styles.projectImg} source={require('../images/ic_customers_menu.png')}></Image>
                                <Text style={{ color: 'black', marginTop: 8, fontWeight: 'bold' }}>New Project</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.projectTask} onPress={() => setShowProjectList(!showProjectList)}>
                            <View style={{
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Image style={styles.projectImg} source={require('../images/ic_customers_menu.png')}></Image>
                                <Text style={{ color: 'black', marginTop: 8, fontWeight: 'bold' }}>Project List</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    {/* projectTask */}

                    {/* stages */}
                    <View style={{
                        flexDirection: "row",
                        justifyContent: 'center',
                        marginVertical: 4,
                        backgroundColor: '#E6E6FA',
                        width: '100%',
                        paddingHorizontal: 8,
                        paddingVertical: 12
                    }}>
                        <ScrollView horizontal={true}>
                            <TouchableOpacity onPress={() => setStage('ALL')} style={{
                                width: 100,
                                height: 100,
                                margin: 8,
                                // padding: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3,
                                elevation: 5,
                            }}>
                                <ImageBackground style={{ height: '100%' }} source={require('../images/work_card.png')}>
                                    <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ALL</Text>

                                    {
                                        selectedStage === 'ALL' &&
                                        <View style={{
                                            position: 'absolute',
                                            left: 5,
                                            bottom: 5
                                        }}>
                                            <Image style={{
                                                width: 25, height: 25
                                            }} source={require('../images/ic_check_scanned_button.png')}></Image>
                                        </View>
                                    }

                                </ImageBackground>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStage('ACCEPTED_OPEN')} style={{
                                width: 100,
                                height: 100,
                                margin: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3,
                                elevation: 5,
                            }}>
                                <ImageBackground style={{ height: '100%' }} source={require('../images/ticket_card.png')}>
                                    <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ACCEPTED OPEN</Text>

                                    {
                                        selectedStage === 'ACCEPTED_OPEN' &&
                                        <View style={{
                                            position: 'absolute',
                                            left: 5,
                                            bottom: 5
                                        }}>
                                            <Image style={{
                                                width: 25, height: 25
                                            }} source={require('../images/ic_check_scanned_button.png')}></Image>
                                        </View>
                                    }
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStage('ACCEPT_PENDING')} style={{
                                width: 100,
                                height: 100,
                                margin: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3,
                                elevation: 5,
                            }}>
                                <ImageBackground style={{ height: '100%' }} source={require('../images/schedule_card.png')}>
                                    <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ACCEPT PENDING</Text>

                                    {
                                        selectedStage === 'ACCEPT_PENDING' &&
                                        <View style={{
                                            position: 'absolute',
                                            left: 5,
                                            bottom: 5
                                        }}>
                                            <Image style={{
                                                width: 25, height: 25
                                            }} source={require('../images/ic_check_scanned_button.png')}></Image>
                                        </View>
                                    }

                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStage('ACCEPT_EXCEEDED')} style={{
                                width: 100,
                                height: 100,
                                margin: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3,
                                elevation: 5,
                            }}>
                                <ImageBackground style={{ height: '100%' }} source={require('../images/schedule_card.png')}>
                                    <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ACCEPT EXCEEDED</Text>

                                    {
                                        selectedStage === 'ACCEPT_EXCEEDED' &&
                                        <View style={{
                                            position: 'absolute',
                                            left: 5,
                                            bottom: 5
                                        }}>
                                            <Image style={{
                                                width: 25, height: 25
                                            }} source={require('../images/ic_check_scanned_button.png')}></Image>
                                        </View>
                                    }

                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStage('ACCEPTED_ON_HOLD')} style={{
                                width: 100,
                                height: 100,
                                margin: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3,
                                elevation: 5,
                            }}>
                                <ImageBackground style={{ height: '100%' }} source={require('../images/schedule_card.png')}>
                                    <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ACCEPTED ON HOLD</Text>

                                    {
                                        selectedStage === 'ACCEPTED_ON_HOLD' &&
                                        <View style={{
                                            position: 'absolute',
                                            left: 5,
                                            bottom: 5
                                        }}>
                                            <Image style={{
                                                width: 25, height: 25
                                            }} source={require('../images/ic_check_scanned_button.png')}></Image>
                                        </View>
                                    }

                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStage('ESCALATED')} style={{
                                width: 100,
                                height: 100,
                                margin: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3,
                                elevation: 5,
                            }}>
                                <ImageBackground style={{ height: '100%' }} source={require('../images/schedule_card.png')}>
                                    <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ESCALATED</Text>

                                    {
                                        selectedStage === 'ESCALATED' &&
                                        <View style={{
                                            position: 'absolute',
                                            left: 5,
                                            bottom: 5
                                        }}>
                                            <Image style={{
                                                width: 25, height: 25
                                            }} source={require('../images/ic_check_scanned_button.png')}></Image>
                                        </View>
                                    }

                                </ImageBackground>
                            </TouchableOpacity>


                        </ScrollView>
                    </View>
                    {/* stages */}


                    {/* allTaskTable */}
                    <View style={{
                        // marginTop: 8,
                        backgroundColor: 'white',
                        marginBottom: 24, width: '96%',

                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3,
                        elevation: 5,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: "center",
                            padding: 8
                        }}>
                            <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>All Task</Text>
                            <View style={{ width: 'auto', flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={hardReset} style={{
                                    padding: 8,
                                    backgroundColor: '#6C757D',
                                    borderRadius: 4,
                                    // backgroundColor: 'white',
                                    padding: 8,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3,
                                    elevation: 5,
                                }}>
                                    <Text style={{ color: 'white' }}>Reset</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowTaskFilter(!showTaskFilter)} style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 8,
                                    backgroundColor: '#F8F9FA',
                                    marginLeft: 14,
                                    padding: 8,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3,
                                    elevation: 5,
                                }}>
                                    <Image style={{ height: 20, width: 20 }} source={require('../images/filterIcon.png')}></Image>
                                    <Text style={{ color: 'black' }}>Filter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.TableContainer}>
                            {/* Table Header */}
                            <View style={styles.tableRow}>
                                <Text style={styles.headerCell}>Name</Text>
                                <Text style={styles.headerCell}>Status & Stage</Text>
                                <Text style={styles.headerCell}>Created on</Text>
                            </View>

                            <ScrollView nestedScrollEnabled={true}>

                                {
                                    showFilterActivity &&
                                    <ActivityIndicator color='blue' size='large'></ActivityIndicator>
                                }

                                {
                                    allTaskData === null && showFilterActivity === false &&
                                    <View style={{
                                        width: '100%',
                                        alignItems: 'center',
                                        padding: 12
                                    }}>
                                        <Text style={{ color: 'red', fontWeight: 16, fontWeight: 'bold' }}>No Data Available</Text>
                                    </View>
                                }

                                {
                                    allTaskData && allTaskData.length === 0 &&

                                    <View style={{
                                        width: '100%',
                                        alignItems: 'center',
                                        padding: 12
                                    }}>
                                        <Text style={{ color: 'red', fontWeight: 16, fontWeight: 'bold' }}>No Data Available</Text>
                                    </View>
                                }

                                {
                                    allTaskData && allTaskData?.map((task, index) => (
                                        <TouchableOpacity style={styles.tableRow} key={index} onPress={() => gotoTaskDetail(task)}>
                                            <Text style={[styles.dataCell, { justifyContent: 'space-between', flexDirection: 'row', width: '100%' }]}>
                                                <Image style={{ width: 24, height: 24, marginRight: 12 }} resizeMode="contain" source={getImageForStatus(task.latest_status)}></Image>
                                                <Text>{task.task_name}</Text>
                                            </Text>
                                            <Text style={styles.dataCell}>{task.latest_status}</Text>
                                            <Text style={styles.dataCell}>{dayjs(task.created_on).format('DD/MM/YYYY')}</Text>
                                        </TouchableOpacity>
                                    ))
                                }

                            </ScrollView>

                        </View>

                    </View>
                    {/* allTaskTable */}

                    {/* statisticChart */}
                    <TaskStatisticsChart />
                    {/* statisticChart */}


                    {/* empLocation */}
                    {/* <EmpLocation setShowMap={setShowMap} showMap={showMap} /> */}

                    <View style={{
                        width: '94%', backgroundColor: 'white', marginBottom: 14, marginTop: 14, shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3,
                        elevation: 5,
                    }}>
                        <View>
                            <Text style={{ color: "black", fontSize: 18, fontWeight: 'bold', padding: 8 }}>Location Details</Text>
                        </View>

                        {
                            empListLoader &&
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        }

                        <View style={{ width: '100%', padding: 4, maxHeight: 450 }}>
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }} vertical={true} nestedScrollEnabled={true}>
                                {
                                    empIdData && empIdData.map((item, index) => (
                                        <View key={index} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' }}>
                                            <Text style={{ color: 'black' }}>{item.EmpId}</Text>
                                            <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, backgroundColor: '#8BC1F7', borderRadius: 4 }}
                                                onPress={() => handleShowMap(item.EmpId)}
                                            >
                                                <Text style={{ color: 'white' }}>Show Location</Text>
                                                <Image style={{ width: 30, height: 30, marginLeft: 8 }} source={location}></Image>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                }
                            </ScrollView>
                        </View>
                    </View>

                    {/* empLocation */}



                </View >

            </ScrollView>

            {
                showMap &&
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', padding: 12 }}>
                            <Text style={{ padding: 8, color: 'black', fontSize: 18 }}>User Location</Text>
                            <TouchableOpacity style={{ backgroundColor: 'red', padding: 8, borderRadius: 4 }} onPress={() => setShowMap(false)}>
                                <Text style={{ color: 'white' }}>Close</Text>
                            </TouchableOpacity>
                        </View>

                        {
                            userLocation === null &&
                            <View style={{ width: '100%', padding: 8, alignItems: 'center' }}>
                                <Text style={{ color: 'red', fontWeight: 'bold' }}>User Location not available</Text>
                            </View>
                        }

                        {/* MAPAREA */}
                        {userLocation && (
                            <View style={styles.mapCont}>
                                <>
                                    <MapView
                                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                        style={styles.map}
                                        initialRegion={{
                                            latitude: userLocation.latitude,
                                            longitude: userLocation.longitude,
                                            latitudeDelta: 0.09,
                                            longitudeDelta: 0.03,
                                        }}
                                    >
                                        <Marker coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}>
                                            <Image
                                                source={mapManS}
                                            // style={{ width: 50, height: 100 }}
                                            />
                                        </Marker>
                                    </MapView>
                                    {/* <MapView style={styles.map} initialRegion={userLocation} provider={PROVIDER_GOOGLE}>
                                        <Marker coordinate={userLocation} />
                                    </MapView> */}
                                    {/* <Text>Test</Text> */}
                                </>
                            </View>
                        )}
                        {/* MAPAREA */}

                        {
                            userLocation &&
                            <View style={{ width: '100%', padding: 8, paddingBottom: 12, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: 'auto' }}>

                                {/* <Text style={{ backgroundColor: 'green', color: 'white', padding: 12, borderRadius: 4 }}>{userLocation.latitude.toFixed(3)}</Text>
                                <Text style={{ backgroundColor: 'green', color: 'white', padding: 12, borderRadius: 4 }}>{userLocation.longitude.toFixed(3)}</Text> */}

                                <Text style={{ padding: 8, margin: 2, backgroundColor: 'green', color: 'white' }}>Latitude: {userLocation.latitude.toFixed(3)}</Text>
                                <Text style={{ padding: 8, margin: 2, backgroundColor: 'green', color: 'white' }}>Longitude: {userLocation.longitude.toFixed(3)}</Text>

                            </View>
                        }
                    </View>
                </View>
            }

            {
                modalVisible &&
                <View
                    // visible={modalVisible}
                    // animationType="slide"
                    // onRequestClose={closeModal}
                    style={styles.modalContainer}
                >
                    {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
                    <View style={styles.modalContent}>
                        <Text>New Message Received!</Text>
                        <Text>{messageData ? JSON.stringify(messageData) : ''}</Text>
                        <Button title="Close Modal" onPress={closeModal} />
                    </View>
                </View>
            }


            {
                showNewTask &&
                <AddNewTask onClose={() => setShowNewTask(false)} fetchAllTasks={fetchAllTasks} showTaskSaveToast={showTaskSaveToast} />
            }

            {
                showProjectList &&
                <ProjectList onClose={() => setShowProjectList(false)} />
            }

            {
                showNewProject &&
                <NewProject onClose={() => setShowNewProject(false)} />
            }

            {
                showTaskFilter &&
                <TaskFilterPop onFilter={handleTaskFilterClick} onClose={() => setShowTaskFilter(false)} />
            }

            {
                msgModal &&
                <View
                    // visible={modalVisible}
                    // animationType="slide"
                    // onRequestClose={closeModal}
                    style={styles.mapmodalContainer}
                >
                    {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
                    <View style={styles.mapmodalContent}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>New Message Received!</Text>
                        <View>
                            <Text>
                                {messageData.task_ownder_id} send you a message
                            </Text>
                        </View>
                        <Button title="OpenChat" onPress={() => navigateToTaskDetails(messageData)} />
                    </View>
                </View>
            }

            {
                newTaskModal &&
                <View
                    // visible={modalVisible}
                    // animationType="slide"
                    // onRequestClose={closeModal}
                    style={styles.mapmodalContainer}
                >
                    {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
                    <View style={styles.mapmodalContent}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>New Task assigned</Text>
                        <View>
                            <Text>
                                {messageData.task_creator_id} assigned you a Task
                            </Text>
                        </View>
                        <Button title="OpenChat" onPress={() => setNewTaskModal(!newTaskModal)} />
                    </View>
                </View>
            }
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    HomeContainer: {
        flex: 1,
        backgroundColor: '#E6E6FA'
    },
    projectTask: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        padding: 14,
        backgroundColor: 'white',
        borderRadius: 4,
        flex: 1,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,

    },
    projectImg: {
        width: 40,
        height: 40
    },
    TableContainer: {
        width: "100%",
        padding: 10,
        marginTop: 2,
        maxHeight: 400
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: 5,
        // paddingVertical: 5,
    },
    headerCell: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        flexWrap: 'nowrap',
        width: 120
    },
    dataCell: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        padding: 10,
        // textAlign: 'center',
        width: 120,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderColor: 'white',
        color: "black"
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

        zIndex: 2,
        backgroundColor: '#00000080',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    modalContent: {
        backgroundColor: '#F7F7F7',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '94%'
    },
    mapmodalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

        zIndex: 2,
        backgroundColor: '#00000080',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    mapmodalContent: {
        backgroundColor: '#F7F7F7',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '94%'
    },
    ViewImgModalWrapper: {
        zIndex: 2,
        backgroundColor: '#00000080',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    ViewImgModal: {
        backgroundColor: 'white',
        position: 'fixed',
        top: '50%',
        left: '6%',
        width: '90%',
        height: '40%',
        borderRadius: 8
    },
    mapCont: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        height: 450,
        width: '100%',
    },
    map: {
        // width: '100%',
        // height: '100%'
        // width: '100%',
        // height: 450,
        ...StyleSheet.absoluteFillObject,
        // width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
    },

})

export default Home