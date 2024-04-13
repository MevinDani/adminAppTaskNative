import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, TextInput, Button, Dimensions } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToastManager, { Toast } from 'toastify-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, PROVIDER_OSMDROID } from 'react-native-maps';
import { PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Linking } from 'react-native';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const AddNewTask = ({ onClose, fetchAllTasks }) => {
    // const [taskComesUnder, setTaskComesUnder] = useState('Common Job')
    // const [taskType, setTaskType] = useState('Inhouse')
    // const [includeTravel, setIncludeTravel] = useState('N')
    // const [priorityLevel, setPriorityLevel] = useState('Moderate')

    const [taskComesUnder, setTaskComesUnder] = useState('')
    const [taskType, setTaskType] = useState('')
    const [includeTravel, setIncludeTravel] = useState('')
    const [priorityLevel, setPriorityLevel] = useState('')


    const [taskList, setTaskList] = useState(null)

    const [modalVisible, setModalVisible] = useState(false);

    const [mapModalVisible, setMapModalVisible] = useState(false)

    const [taskname, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    const [userData, setUserData] = useState(null)

    const [empId, setEmpId] = useState('')

    const [userAttendance, setUserAttendance] = useState(null)

    const [checkInOutText, setCheckInOut] = useState('')

    const [projectList, setProjectList] = useState(null)

    const [showProject, setShowProject] = useState(false)

    const [selectedProject, setSelectedProject] = useState('')

    const navigation = useNavigation()

    const handleTaskComeUnder = (option) => {
        setTaskComesUnder(option)
    }


    const handleTaskType = (option) => {
        setTaskType(option)
    }


    const handleIncludeTravel = (option) => {
        setIncludeTravel(option)
    }


    const handlePriorityLevel = (option) => {
        setPriorityLevel(option)
    }

    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainList/CPAYS/owner/${empId}/-/-/-/-/2024-01-10/2024-12-28/-`);
    //         // const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainList/CPAYS/owner/AJMAL/-/-/-/-/2024-01-10/2024-12-28/-`);
    //         setTaskList(response.data);
    //         console.log('fetchData')
    //     } catch (error) {
    //         console.log(error, 'getTaskListError')
    //     }
    // };

    // const fetchDataNew = async () => {
    //     try {
    //         const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainList/CPAYS/owner/${empId}/-/-/-/-/2024-01-10/2024-12-28/-`);
    //         // const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainList/CPAYS/owner/AJMAL/-/-/-/-/2024-01-10/2024-03-28/-`);
    //         setTaskList(response.data);
    //         showTaskSaveToast()
    //         console.log('fetchDataNew')
    //     } catch (error) {
    //         console.log(error, 'getTaskListError')
    //     }
    // };

    // const fetchUserAttendance = async () => {
    //     try {
    //         const response = await axios.get(`https://cubixweberp.com:156/api/CRMAttendanceList/CPAYS/${empId}`);
    //         setUserAttendance(response.data);
    //     } catch (error) {
    //         console.log(error, 'getTaskListError')
    //     }
    // }

    // useEffect(() => {
    //     const currentDate = new Date();
    //     const currentDateString = currentDate.toISOString().slice(0, 10); // Get the date part of the ISO string

    //     if (userAttendance && userAttendance.length > 0) {
    //         // Check if the punch_time is from today
    //         const punchTime = new Date(userAttendance[0].punch_time);
    //         const punchTimeString = punchTime.toISOString().slice(0, 10); // Get the date part of the ISO string

    //         if (punchTimeString === currentDateString && userAttendance[0].type === 'IN') {
    //             console.log('Punch time is from today');
    //             setCheckInOut('CHECKOUT');
    //             const latitude = userAttendance && parseFloat(userAttendance[0].latitude);
    //             const longitude = userAttendance && parseFloat(userAttendance[0].longitude);


    //             const fetchUserData = async () => {
    //                 try {
    //                     let userDataJson = await AsyncStorage.getItem('userData');
    //                     let userData = JSON.parse(userDataJson) || {};

    //                     // const latitude = mapRegion && mapRegion.latitude
    //                     // const longitude = mapRegion && mapRegion.longitude

    //                     // Add latitude and longitude to userData
    //                     userData.latitude = latitude;
    //                     userData.longitude = longitude;

    //                     // Update state with modified userData
    //                     setUserData(userData);
    //                     setEmpId(userData.empid);

    //                     // Store updated userData back to AsyncStorage
    //                     await AsyncStorage.setItem('userData', JSON.stringify(userData));

    //                     console.log('userData', userData);
    //                     // showUserDataToast(userData);

    //                 } catch (error) {
    //                     console.error('Error fetching user data:', error);
    //                 }
    //             };

    //             fetchUserData();
    //             // Update UI or perform actions accordingly
    //             setMapRegion(prevRegion => ({
    //                 ...prevRegion,
    //                 latitude,
    //                 longitude
    //             }));
    //         } else if (punchTimeString === currentDateString && userAttendance[0].type === 'OUT') {
    //             console.log('Punch time is from today, but type is OUT');
    //             setCheckInOut('CHECKIN');
    //         } else if (punchTimeString !== currentDateString) {
    //             console.log('Punch time is not from today');
    //             setCheckInOut('CHECKIN');
    //         }
    //     }
    // }, [userAttendance]); // Run this effect whenever userAttendance changes

    // console.log('userAttendance', userAttendance)
    // console.log('userData', userData)

    // useEffect(() => {
    //     if (mapRegion.latitude !== 0) {
    //         const fetchUserData = async () => {
    //             try {
    //                 let userDataJson = await AsyncStorage.getItem('userData');
    //                 let userData = JSON.parse(userDataJson) || {};

    //                 const latitude = mapRegion && mapRegion.latitude
    //                 const longitude = mapRegion && mapRegion.longitude

    //                 // Add latitude and longitude to userData
    //                 userData.latitude = latitude;
    //                 userData.longitude = longitude;

    //                 // Update state with modified userData
    //                 setUserData(userData);
    //                 setEmpId(userData.empid);

    //                 // Store updated userData back to AsyncStorage
    //                 await AsyncStorage.setItem('userData', JSON.stringify(userData));

    //                 console.log(userData, 'userData');
    //                 // showUserDataToast(userData);

    //             } catch (error) {
    //                 console.error('Error fetching user data:', error);
    //             }
    //         };

    //         fetchUserData();
    //     }
    // }, [mapRegion])

    // console.log(userAttendance)
    // console.log(mapRegion)

    // useEffect(() => {
    //     if (empId) fetchData();
    // }, [empId])

    // useEffect(() => {
    //     if (empId) {
    //         fetchUserAttendance()
    //     }
    // }, [empId])

    const showUserDataToast = (userData) => {
        if (userData && userData.empid) {
            Toast.success(`Welcome ${userData.empid}`);
        }
    }


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataJson = await AsyncStorage.getItem('userData');
                const userData = JSON.parse(userDataJson);
                // Now you have userData, you can use it here
                setUserData(userData)
                setEmpId(userData.empid)
                console.log(userData, 'userData')
                // showUserDataToast(userData)

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    console.log(userData, 'userData')

    const showTaskSaveToast = () => {
        Toast.success('Task Added Successfully')
    }

    const showEmptyTaskFields = () => {
        Toast.error('Form is not filled!')
    }

    const ErrorAddTask = () => {
        Toast.error('Some Error Occured')
    }

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    const [combinedDateTime, setCombinedDateTime] = useState('')

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
        console.warn("A date has been picked: ", date);

        // Extract date part
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // Formatted date in yyyy-MM-dd format
        const formattedDate = `${year}-${month}-${day}`;

        setDate(formattedDate);
        hideDatePicker();
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (time) => {
        console.warn("A time has been picked: ", time);

        // Extract time part
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        const seconds = String(time.getSeconds()).padStart(2, '0');

        // Formatted time in HH:mm:ss format
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        setTime(formattedTime);
        hideTimePicker();
    };

    // Combine date and time into a single Date object
    const combineDateTime = () => {
        // Get date object from formatted date string
        const dateParts = date.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Month is zero-based
        const day = parseInt(dateParts[2]);

        // Get time object from formatted time string
        const timeParts = time.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const seconds = parseInt(timeParts[2]);

        // Create combined Date object
        const combinedDateTime = new Date(year, month, day, hours, minutes, seconds);

        setCombinedDateTime(combinedDateTime)

        // Use combinedDateTime as needed
        console.log("Combined DateTime:", combinedDateTime);
    };

    useEffect(() => {
        if (date && time) {
            combineDateTime()
        }
    }, [date, time])

    const getPriorityColor = priority => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return '#870404';
            case 'moderate':
                return '#F0D802';
            case 'low':
                return '#36CC36';
            default:
                return '#F3F3F3'; // Default color
        }
    };

    const getTextColor = (priority) => {
        return priority === 'High' || priority === 'Low' ? '#FFFFFF' : '#000000'; // White for High and Low, black for others
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const saveTask = async () => {
        if (taskname !== '' && taskDescription !== '' && includeTravel !== null && priorityLevel !== null && taskComesUnder !== null && taskType !== null) {
            console.log('field is filled')
            try {

                const createdOn = getCurrentDateTime();

                const requestData = [
                    {
                        "cmpcode": "CPAYS",
                        "mode": "ENTRY",
                        "task_id": "DE9ECBC2-F1DF-40F1-BC67-4BD3087978BD",
                        "task_name": taskname,
                        "task_description": taskDescription,
                        "include_travel": includeTravel,
                        "job_code": "",
                        "priority": priorityLevel,
                        "task_scheduledon": combinedDateTime,
                        "task_owner_id": empId,
                        "task_ownder_name": empId,
                        "task_ownder_dept": "",
                        "task_comes_under": taskComesUnder,
                        "task_type": taskType,
                        "latest_status": "",
                        "latest_status_code": "",
                        "latest_stage": "",
                        "latest_stage_code": "",
                        "created_on": createdOn,
                        "task_creator_name": empId,
                        "task_creator_id": empId
                    }
                ];

                console.log('Request Data:', requestData);

                const response = await axios.post('https://cubixweberp.com:156/api/CRMTaskMain', requestData);

                console.log('Response:', response.data);

                // Assuming a successful response has status code 200
                if (response.status === 200) {
                    showTaskSaveToast()
                    fetchAllTasks()
                    // fetchDataNew()
                    // Task saved successfully, handle any further actions here
                    console.log('Task saved successfully');
                    console.log(response.data)
                    // setModalVisible(false)
                } else {
                    // Handle other status codes if needed
                    console.error('Failed to save task:', response.statusText);
                    console.log(response)
                    setModalVisible(false)
                }
                setModalVisible(false)
                onClose()
            } catch (error) {
                // Handle network errors or other issues
                console.error('Error while saving task:', error);
                ErrorAddTask()
            }

        } else {
            console.log('field is empty')
            showEmptyTaskFields()
        }
    };

    useEffect(() => {
        const fetchProjectList = async () => {
            try {
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMProjectList/CPAYS/-`)
                setProjectList(response.data)
            } catch (error) {
                console.log('projectListErr', error)
            }
        }
        fetchProjectList()
    }, [])

    useEffect(() => {
        if (taskComesUnder === 'Project') {
            setShowProject(true)
        } else {
            setShowProject(false)
            setSelectedProject('')
        }
    }, [taskComesUnder])

    useEffect(() => {
        if (modalVisible === false) {
            setTaskName('')
            setTaskDescription('')
            setTaskComesUnder(null)
            setTaskType(null)
            setIncludeTravel(null)
            setPriorityLevel(null)
            setCombinedDateTime('')
            setDate('')
            setTime('')
        }
    }, [modalVisible])

    useEffect(() => {
        if (mapModalVisible === true) {
            requestLocationPermission()
        }
    }, [mapModalVisible])

    // tasklistclick

    const gotoTaskDetail = (task) => {
        navigation.navigate('TaskDetails', {
            task_id: task.task_id,
            created_on: task.created_on,
            task_scheduledon: task.task_scheduledon
        });
    };
    return (
        <View style={styles.modalContainer}>
            <ToastManager />
            <View style={styles.modalContent}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'left', width: '100%', color: 'black'
                }}>New Task</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setTaskName(text)}
                        value={taskname}
                        placeholder='task name'
                    />
                </View>

                <View style={[styles.inputContainer, { marginBottom: 8 }]}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setTaskDescription(text)}
                        value={taskDescription}
                        placeholder='task description'
                    />
                </View>

                <View style={styles.taskComesUnderCont}>
                    <TouchableOpacity style={{
                        margin: 4,
                        backgroundColor: 'black',
                        color: 'white',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderRadius: 4
                    }}
                        onPress={() => handleTaskComeUnder('Common Job')}
                    >
                        <Text style={[styles.defaultOption, taskComesUnder === 'Common Job' && styles.selectedOption]}></Text>
                        <Text style={{ color: 'white', marginLeft: 12 }}>Common Job</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        margin: 4,
                        backgroundColor: 'black',
                        color: 'white',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderRadius: 4
                    }}
                        onPress={() => handleTaskComeUnder('Project')}
                    >
                        <Text style={[styles.defaultOption, taskComesUnder === 'Project' && styles.selectedOption]}></Text>
                        <Text style={{ color: 'white', marginLeft: 12 }}>Project</Text>
                    </TouchableOpacity>
                </View>

                {/* {
                    selectedProject !== '' &&

                    <View style={{ margin: 2, width: '100%' }}>
                        <Text>{selectedProject}</Text>
                    </View>

                }

                {
                    showProject &&

                    <View style={{
                        width: '100%',
                        marginBottom: 4
                    }}>
                        <View>
                            {
                                projectList && projectList.map((item, index) => (
                                    <ScrollView key={index} vertical={true}>
                                        <TouchableOpacity onPress={() => setSelectedProject(item.Description)}>
                                            <Text style={{
                                                backgroundColor: 'white',
                                                color: 'black',
                                                padding: 4,
                                                paddingTop: 8,
                                                paddingBottom: 8,
                                                margin: 2
                                            }}>{item.Description}</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                ))
                            }
                        </View>
                    </View>
                } */}

                <View style={{
                    textAlign: 'left',
                    width: '100%'
                }}><Text>Task Type</Text></View>

                <View style={styles.taskComesUnderCont}>
                    <TouchableOpacity style={{
                        margin: 4,
                        backgroundColor: 'black',
                        color: 'white',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderRadius: 4
                    }}
                        onPress={() => handleTaskType('Inhouse')}
                    >
                        <Text style={[styles.defaultOption, taskType === 'Inhouse' && styles.selectedOption]}></Text>
                        <Text style={{ color: 'white', marginLeft: 12 }}>Inhouse</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        margin: 4,
                        backgroundColor: 'black',
                        color: 'white',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderRadius: 4
                    }}
                        onPress={() => handleTaskType('Outdoor')}
                    >
                        <Text style={[styles.defaultOption, taskType === 'Outdoor' && styles.selectedOption]}></Text>
                        <Text style={{ color: 'white', marginLeft: 12 }}>Outdoor</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dateTimeCont}>

                    <View>
                        <Text>
                            Select Task Start Date and Time
                        </Text>
                    </View>

                    {/* <View style={{ width: '85%' }}>
                                    <Button title="Select Date" onPress={showDatepicker} />
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={chosenDate}
                                            mode="datetime"
                                            is24Hour={true}
                                            display="default"
                                            onChange={onDateChange}
                                        />
                                    )}
                                </View> */}

                    <View style={{ width: '98%', justifyContent: 'space-between', flexDirection: "row" }}>
                        <Button title="Show Pick Date" onPress={showDatePicker} />
                        <Button title="Show Pick Time" onPress={showTimePicker} />
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleDateConfirm}
                            onCancel={hideDatePicker}
                        />
                        <DateTimePickerModal
                            isVisible={isTimePickerVisible}
                            mode="time"
                            onConfirm={handleTimeConfirm}
                            onCancel={hideTimePicker}
                        />
                    </View>

                </View>

                {
                    combinedDateTime === '' && date &&
                    <View style={{
                        backgroundColor: 'green',
                        padding: 8,
                        borderRadius: 4
                    }}>
                        <Text style={{ color: 'white' }}>{date ? date : ''}</Text>
                    </View>
                }

                {
                    combinedDateTime === '' && time &&
                    <View style={{
                        backgroundColor: 'green',
                        padding: 8,
                        borderRadius: 4
                    }}>
                        <Text style={{ color: 'white' }}>{time ? time : ''}</Text>
                    </View>
                }

                {
                    combinedDateTime !== '' &&
                    <View style={{
                        backgroundColor: 'green',
                        padding: 8,
                        borderRadius: 4
                    }}>
                        <Text style={{ color: 'white' }}>{combinedDateTime ? combinedDateTime.toLocaleString() : ''}</Text>
                    </View>
                }



                <View style={{
                    textAlign: 'left',
                    width: '100%'
                }}><Text>Include Travel</Text></View>

                <View style={styles.taskComesUnderCont}>
                    <TouchableOpacity style={{
                        margin: 4,
                        backgroundColor: 'black',
                        color: 'white',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderRadius: 4
                    }}
                        onPress={() => handleIncludeTravel('Y')}
                    >
                        <Text style={[styles.defaultOption, includeTravel === 'Y' && styles.selectedOption]}></Text>
                        <Text style={{ color: 'white', marginLeft: 12 }}>Yes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        margin: 4,
                        backgroundColor: 'black',
                        color: 'white',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderRadius: 4
                    }}
                        onPress={() => handleIncludeTravel('N')}
                    >
                        <Text style={[styles.defaultOption, includeTravel === 'N' && styles.selectedOption]}></Text>
                        <Text style={{ color: 'white', marginLeft: 12 }}>No</Text>
                    </TouchableOpacity>
                </View>


                <View style={{
                    textAlign: 'left',
                    width: '100%'
                }}><Text>Priority level</Text></View>

                <View style={styles.taskComesUnderCont}>
                    <TouchableOpacity style={{
                        margin: 4,
                        backgroundColor: 'black',
                        color: 'white',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderRadius: 4
                    }}
                        onPress={() => handlePriorityLevel('Low')}
                    >
                        <Text style={[styles.defaultOption, priorityLevel === 'Low' && styles.selectedOption]}></Text>
                        <Text style={{ color: 'white', marginLeft: 12 }}>Low</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        margin: 4,
                        backgroundColor: 'black',
                        color: 'white',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderRadius: 4
                    }}
                        onPress={() => handlePriorityLevel('Moderate')}
                    >
                        <Text style={[styles.defaultOption, priorityLevel === 'Moderate' && styles.selectedOption]}></Text>
                        <Text style={{ color: 'white', marginLeft: 12 }}>Moderate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        margin: 4,
                        backgroundColor: 'black',
                        color: 'white',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderRadius: 4
                    }}
                        onPress={() => handlePriorityLevel('High')}
                    >
                        <Text style={[styles.defaultOption, priorityLevel === 'High' && styles.selectedOption]}></Text>
                        <Text style={{ color: 'white', marginLeft: 12 }}>High</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    justifyContent: 'flex-end',
                    flexDirection: "row",
                    width: '100%',
                    borderTopColor: 'black',
                    borderTopWidth: 1
                    // backgroundColor: 'black'
                }}>

                    <View style={{
                        margin: 4,
                        backgroundColor: 'red',
                        color: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 4,
                        paddingHorizontal: 4
                    }}>
                        <TouchableOpacity onPress={onClose} style={{
                            margin: 4,
                            backgroundColor: 'red',
                            color: 'white'
                        }}>
                            <Text style={styles.closeModalButton}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        margin: 4,
                        backgroundColor: 'green',
                        color: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 4,
                        paddingHorizontal: 4
                    }}>
                        <TouchableOpacity onPress={() => saveTask()} style={{
                            margin: 4,
                            color: 'white'
                        }}>
                            <Text style={styles.closeModalButton}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    TaskHomeWrapper: {
        flex: 1,
        alignItems: "center",
    },
    THHeaderNav: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 14
    },
    THUserBanner: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: "center",
    },
    button: {
        width: '45%',
        backgroundColor: '#303289',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "center"
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    AddButton: {
        alignItems: "flex-end",
        width: "100%",
        paddingRight: 14,
        paddingTop: 14,
        color: "black"
    },
    buttonAdd: {
        width: '45%',
        backgroundColor: '#FFC107',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "center",
        color: 'black'
    },
    TableContainer: {
        width: "100%",
        padding: 10,
        marginTop: 8
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
        textAlign: 'center',
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
    closeModalButton: {
        marginTop: 10,
        fontSize: 18,
        color: 'white',
    },
    inputContainer: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        marginTop: 12,
    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: 'white',
        paddingLeft: 10,
    },
    taskComesUnderCont: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 8
    },
    defaultOption: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        borderRadius: 50
    },
    selectedOption: {
        width: 20,
        height: 20,
        backgroundColor: 'gold',
        borderRadius: 50
    },
    dateTimeCont: {
        justifyContent: "center",
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 12
    },
    mapCont: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        height: 400,
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
    }
})

export default AddNewTask