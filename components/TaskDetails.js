import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, TextInput, ScrollView } from 'react-native'
import userAvt from '../images/userAvt.png'
import ViewJobList from '../images/ic_view_job_list.png'
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
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from './Header'
import DocumentPicker from 'react-native-document-picker';
import ToastManager, { Toast } from 'toastify-react-native'


const TaskDetails = () => {
    const route = useRoute()
    const { task_id, created_on, task_scheduledon } = route.params;
    const createdDate = created_on.split('T')[0]; // Extract date part
    const scheduledDate = task_scheduledon.split('T')[0]; // Extract date part

    const [userData, setUserData] = useState(null)

    const [taskData, setTaskData] = useState(null)
    const [taskHistory, setTaskHistory] = useState(null)
    const [allStatusList, setAllStatusList] = useState(null)
    const [statusArray, setStatusArray] = useState([])

    const [statusDescription, setStatusDescription] = useState('')
    const [fileDescription, setFileDescription] = useState('')

    const [endStatusFlow, setEndStatusFlow] = useState([])

    const initStatus = ['ESCALATED', 'ACCEPTED_OPEN', 'ACCEPTED_ON_HOLD']
    const travelStart = ['TRAVEL_START']
    const travelStop = ['TRAVEL_END']
    const taskStart = ['TASK_START']
    const taskStop = ['TASK_END']
    const lastStatus = ['CUSTOMER_REJECTION', 'COMPLETED', 'BEYOND THE SCOPE']

    const [selectedStatus, setSelectedStatus] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);

    const [userAttendance, setUserAttendance] = useState(null);

    const [viewImage, setViewImage] = useState(false)

    const [imageApiData, setImageApiData] = useState(null)

    const [modifiedImgData, setModifiedImgData] = useState(null)

    const [viewImgPop, setImagePoP] = useState(false)

    const [timeDifference, setTimeDifference] = useState([])

    const [finalTaskHistory, setFinalTaskHistory] = useState(null)

    const [clickedLong, selectClickedLong] = useState('')
    const [clickedLat, selectClickedLat] = useState('')

    const [showLocationPop, setShowLocationPop] = useState(false)

    let currentDate = new Date();
    let formattedDate = currentDate.toISOString().replace("T", " ").replace("Z", "");

    // console.log(formattedDate);



    const handleStatusClick = (item) => {
        setSelectedStatus(item === selectedStatus ? null : item);
    };

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             const userDataJson = await AsyncStorage.getItem('userData');
    //             const userData = JSON.parse(userDataJson);
    //             // Now you have userData, you can use it here
    //             setUserData(userData)
    //             console.log('userData', userData)

    //         } catch (error) {
    //             console.error('Error fetching user data:', error);
    //         }
    //     };
    //     fetchUserData();
    // }, []);

    useEffect(() => {
        const fetchTaskData = async () => {
            if (task_id) {
                try {
                    const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainList/CPAYS/single/-/-/-/${task_id}/-/${createdDate}/${scheduledDate}/-`);
                    const data = response.data;
                    setTaskData(data)

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchTaskData();
    }, [task_id])

    const fetchHistoryData = async () => {
        if (task_id) {
            try {
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTAskHistoryList/cpays/all/-/${task_id}/`);
                const data = response.data;

                if (data.length > 0) {
                    setTaskHistory(data)
                } else {

                    console.log('no data in api')
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    useEffect(() => {

        fetchHistoryData();
    }, [task_id])

    useEffect(() => {
        if (taskHistory && taskHistory.length > 0 && taskHistory[0].hasOwnProperty('name_of_file_uploaded')) {
            if (taskHistory[0].name_of_file_uploaded === 'Y') {
                setViewImage(true);
            } else {
                setViewImage(false);
            }
        } else {
            setViewImage(false);
        }
    }, [taskHistory]);

    useEffect(() => {
        const fetchStatusListAll = async () => {
            try {
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTAskStageList/CPAYS/all/-`);
                const data = response.data;
                setAllStatusList(data)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchStatusListAll()
    }, [])

    useEffect(() => {
        if (taskHistory && taskData) {
            if (taskHistory.length == 0) {
                setStatusArray(initStatus)
            } else if (taskHistory[0].task_status === 'ACCEPTED_OPEN' && taskData[0]?.include_travel === 'Y') {
                setStatusArray(travelStart)
            } else if (taskHistory[0].task_status === 'ACCEPTED_OPEN' && taskData[0]?.include_travel === 'N') {
                setStatusArray(taskStart)
            } else if (taskHistory[0].task_status === 'TRAVEL_START') {
                setStatusArray(travelStop)
            } else if (taskHistory[0].task_status === 'TASK_START') {
                setStatusArray(taskStop)
            } else if (taskHistory[0].task_status === 'TRAVEL_END') {
                setStatusArray(taskStart)
            } else if (taskHistory[0].task_status === 'TASK_END') {
                setStatusArray(lastStatus)
            } else if (taskHistory[0].task_status === 'ESCALATED' || taskHistory[0].task_status === 'ACCEPTED_ON_HOLD' || taskHistory[0].task_status === 'CUSTOMER_REJECTION' || taskHistory[0].task_status === 'COMPLETED' || taskHistory[0].task_status === 'BEYOND THE SCOPE') {
                setEndStatusFlow([taskHistory[0].task_status]);
            }
        }
    }, [taskHistory, taskData])

    // console.log('statusArray', statusArray)

    console.log('userData', userData)

    // taskstatusSave
    // const taskStatusSave = async () => {

    //     setStatusDescription('')

    //     const statusCode = allStatusList.find((item) => item.code_name === selectedStatus)?.code_value;

    //     // console.log('statusCode', statusCode)

    //     let reqData = [
    //         {
    //             cmpcode: "CPAYS",
    //             mode: "ENTRY",
    //             task_id: task_id,
    //             task_status: selectedStatus,
    //             task_status_code: statusCode,
    //             task_status_description: statusDescription,
    //             task_stage: taskHistory.length === 0 ? '' : selectedStatus,
    //             task_stage_code: taskHistory.length === 0 ? '0' : statusCode,
    //             task_stage_description: statusDescription,
    //             task_scheduledon: task_scheduledon,
    //             task_ownder_id: userData && userData.empid,
    //             task_ownder_name: userData && userData.Name,
    //             latitude: userData && userData.latitude.toString(),
    //             longitude: userData && userData.longitude.toString(),
    //             created_on: currentDate,
    //             name_of_file_uploaded: "",
    //         }
    //     ]

    //     console.log('reqData', reqData)

    //     let stringifiedJson = JSON.stringify(reqData)

    //     console.log('stringifiedJson', stringifiedJson)
    //     try {
    //         await axios.post(`https://cubixweberp.com:156/api/CRMTaskHistory`, stringifiedJson, {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         }).then((res) => {
    //             console.log(res, 'taskSave')
    //             fetchHistoryData()
    //             setSelectedStatus(null)
    //         })
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // }

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
            case '':
                return TaskOpen
            case '0':
                return TaskOpen
            case 0:
                return TaskOpen
            // Add cases for other statuses as needed
            default:
                return TaskOpen;
            // Add cases for other statuses as needed
            // default:
            //     return require('../images/default_image.png');
        }
    };

    // toast

    const showFileUploadToast = () => {
        Toast.success('File Uploaded Successfully')
    }

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const handleFileSelection = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            if (res) {
                console.log('res', res)
                setSelectedFile(res)
                console.log(
                    res.uri,
                    res.type, // mime type
                    res.name,
                    res.size
                );
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
                console.log('User cancelled the picker');
            } else {
                throw err;
            }
        }
    };

    const handleUpload = async () => {
        try {
            // Create FormData object
            const formData = new FormData();
            const file = {
                uri: selectedFile[0].uri,
                type: selectedFile[0].type,
                name: selectedFile[0].name,
            };

            console.log(file)
            formData.append('image', file);; // Append the selected file
            formData.append('description', fileDescription);
            formData.append('UserId', taskHistory && taskHistory[0].id);
            formData.append('imagepath', selectedFile[0].uri);

            console.log(formData)
            // Send POST request using Axios
            const response = await axios.post(
                'https://cubixweberp.com:190/Posts',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Upload success:', response);
            if (response.status === 200) {
                setFileDescription('')
                setSelectedFile(null)
                showFileUploadToast()
                fetchHistoryData()
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const getImage = async (id) => {
        setImagePoP(true)
        try {
            const response = await axios.get(`https://cubixweberp.com:156/api/CRMTAskImageList/cpays/${id}`)
            console.log(response.data)
            setImageApiData(response.data)
        } catch (error) {
            console.log('getImageError', error)
        }
        // if (taskHistory) {
        // }
    }

    const imgBaseUrl = "https://cubixweberp.com/cubix_taskify/dummy/";

    useEffect(() => {
        if (imageApiData) {
            const modifiedData = imageApiData.map(item => {
                const imagePathParts = item.Imagepath.split("\\");
                const filename = imagePathParts[imagePathParts.length - 1];
                const imagePath = imgBaseUrl + filename;

                return {
                    ...item,
                    Imagepath: imagePath
                };
            });
            // console.log(modifiedData);
            if (modifiedData) setModifiedImgData(modifiedData)
        }

    }, [imageApiData])


    console.log('modifiedImgData', modifiedImgData)


    useEffect(() => {
        if (taskData) {
            const fetchUserAttendance = async () => {
                try {
                    const response = await axios.get(`https://cubixweberp.com:156/api/CRMAttendanceList/CPAYS/${taskData[0].task_owner_id}`);
                    setUserAttendance(response.data);
                } catch (error) {
                    console.error('Error fetching user attendance:', error);
                }
            };

            fetchUserAttendance();
        }

    }, [taskData]);

    useEffect(() => {
        if (taskHistory) {
            // Reverse the taskHistory array
            const reversedTaskHistory = taskHistory.slice().reverse();

            // Map the reversed array to add time difference
            const updatedTaskHistory = reversedTaskHistory.map((item, index, arr) => {
                if (index === 0) {
                    // For the last item (after reversing), set the time difference as 0
                    return { ...item, timeDifference: 0 };
                } else {
                    // Calculate the time difference between the current item and the next item (after reversing)
                    const currentCreatedTime = new Date(item.created_on).getTime();
                    const nextCreatedTime = new Date(arr[index - 1].created_on).getTime();
                    const timeDifferenceMs = nextCreatedTime - currentCreatedTime;
                    const timeDifferenceHrs = timeDifferenceMs / (1000 * 60 * 60); // Convert milliseconds to hours
                    return { ...item, timeDifference: timeDifferenceHrs };
                }
            });

            const finalTaskHistory = updatedTaskHistory.slice().reverse();

            setFinalTaskHistory(finalTaskHistory)

            // Now you can use updatedTaskHistory for rendering


            console.log('finalTaskHistory', finalTaskHistory)
        }
    }, [taskHistory])

    const showLocation = async (lat, long) => {
        setShowLocationPop(true)
        console.log(lat, long)
    }



    console.log('timeDifference', timeDifference)

    console.log('userAttendanceFromDet', userAttendance)

    // console.log(taskData)
    console.log('taskHistory', taskHistory)

    // console.log(allStatusList)

    // console.log(statusArray)

    // console.log(task_id, created_on, task_scheduledon)
    return (
        <SafeAreaView style={styles.container}>
            <ToastManager width={350} height={100} textStyle={{ fontSize: 17 }} />
            <Header />

            <ScrollView vertical={!viewImgPop} style={{
                marginTop: 8
            }}>
                <View style={styles.TaskHomeWrapper}>

                    {/* HeaderNav */}
                    {/* <View style={styles.THHeaderNav}>
                        <View><Text>EXPERT</Text></View>
                        <View>
                            <Image source={require('../images/ic_hamburger.png')}></Image>
                        </View>
                    </View> */}


                    {/* UserBanner */}
                    <ImageBackground source={require('../images/header_background.png')} style={{
                        width: "100%",
                        marginTop: 12,
                        // paddingVertical: 24,
                        height: 110,
                        display: "flex",
                        justifyContent: "flex-end"
                        // paddingHorizontal: 0
                    }}>
                    </ImageBackground>

                    <View style={{
                        width: "100%",
                        justifyContent: 'flex-start',
                        margin: 8,
                        padding: 4,
                        backgroundColor: 'white'
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Task Details</Text>
                    </View>

                    <View style={{
                        width: "100%",
                        justifyContent: 'flex-start',
                        margin: 8,
                        padding: 4,
                        backgroundColor: 'white'
                    }}>
                        <Text style={{ fontSize: 16, color: 'grey' }}>task name</Text>
                        <Text style={{ fontSize: 16, color: 'black' }}>{taskData ? taskData[0].task_name : ''}</Text>
                    </View>

                    <View style={{
                        width: "100%",
                        justifyContent: 'flex-start',
                        margin: 8,
                        padding: 4,
                        backgroundColor: 'white'
                    }}>
                        <Text style={{ fontSize: 16, color: 'grey' }}>task description</Text>
                        <Text style={{ fontSize: 16, color: 'black' }}>{taskData ? taskData[0].task_description : ''}</Text>

                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        backgroundColor: 'white'
                    }}>

                        <View style={{
                            width: '40%',
                            padding: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 14,
                            margin: 4,
                            borderColor: 'gray', // Border color
                            borderWidth: 1, // Border width
                            shadowColor: "black",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 1.41,

                            elevation: 1,

                        }}>
                            <Text style={{ fontSize: 16, color: 'grey' }}>travel included</Text>
                            <Text style={{ fontSize: 16, color: 'black' }}>{taskData ? taskData[0].include_travel : ''}</Text>
                        </View>
                        <View style={{
                            width: '40%',
                            padding: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 14,
                            margin: 4,
                            borderColor: 'gray', // Border color
                            borderWidth: 1, // Border width
                            shadowColor: "black",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 1.41,

                            elevation: 1,
                        }}>
                            <Text style={{ fontSize: 16, color: 'grey' }}>priority</Text>
                            <Text style={{ fontSize: 16, color: 'black' }}>{taskData ? taskData[0].priority : ''}</Text>
                        </View>
                        <View style={{
                            width: '40%',
                            padding: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 14,
                            margin: 4,
                            borderColor: 'gray', // Border color
                            borderWidth: 1, // Border width
                            shadowColor: "black",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 1.41,

                            elevation: 1,
                        }}>
                            <Text style={{ fontSize: 16, color: 'grey' }}>task start date</Text>
                            <Text style={{ fontSize: 16, color: 'black' }}>{scheduledDate}</Text>
                        </View>
                        <View style={{
                            width: '40%',
                            padding: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 14,
                            margin: 4,
                            borderColor: 'gray', // Border color
                            borderWidth: 1, // Border width
                            shadowColor: "black",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 1.41,

                            elevation: 1,
                        }}>
                            <Text style={{ fontSize: 16, color: 'grey' }}>task assigned to</Text>
                            <Text style={{ fontSize: 16, color: 'black' }}>{taskData ? taskData[0].task_owner_name : ''}</Text>
                        </View>
                        <View style={{
                            width: '40%',
                            padding: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 14,
                            margin: 4,
                            borderColor: 'gray', // Border color
                            borderWidth: 1, // Border width
                            shadowColor: "black",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 1.41,

                            elevation: 1,

                        }}>
                            <Text style={{ fontSize: 16, color: 'grey' }}>task type</Text>
                            <Text style={{ fontSize: 16, color: 'black' }}>{taskData ? taskData[0].task_type : ''}</Text>
                        </View>
                    </View>

                    {/* {
                        userAttendance && userAttendance[0].type === 'IN' && */}

                    <>
                        {/* <View style={{
                                width: '98%',
                                padding: 12,
                                margin: 8,
                                backgroundColor: '#F8F8FF',
                                borderRadius: 4
                            }}>


                                <View>
                                    <Text style={{
                                        color: 'black'
                                    }}>final status</Text>
                                </View>

                                <View style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap'
                                }}>
                                    {
                                        endStatusFlow.length == 0 &&
                                        <>

                                            {
                                                statusArray.map((status, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => handleStatusClick(status)}
                                                        style={{
                                                            backgroundColor: selectedStatus === status ? '#0D6EFD' : '#F1F1F1',
                                                            padding: 8,
                                                            margin: 4,
                                                            borderRadius: 4,
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            width: 'auto',
                                                            height: "auto"
                                                        }}
                                                    >
                                                        <Image style={{ width: 25, height: 25, marginRight: 12 }} source={getImageForStatus(status)}></Image>
                                                        <Text style={{ color: selectedStatus === status ? 'white' : 'black' }}>{status}</Text>
                                                    </TouchableOpacity>
                                                ))
                                            }
                                        </>
                                    }

                                    {
                                        endStatusFlow.length > 0 &&
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#0D6EFD',
                                                padding: 8,
                                                margin: 4,
                                                borderRadius: 4
                                            }}
                                        >
                                            <Text style={{ color: 'white' }}>{endStatusFlow[0]}</Text>
                                        </TouchableOpacity>
                                    }

                                </View>

                                <View>
                                    {
                                        endStatusFlow.length == 0 &&
                                        <>
                                            <View>
                                                <Text>optional</Text>
                                            </View>
                                            <View style={[styles.inputContainer]}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder='Enter description'
                                                    onChangeText={text => setStatusDescription(text)}
                                                    value={statusDescription}
                                                />
                                            </View>
                                        </>
                                    }

                                    {
                                        selectedStatus &&
                                        <TouchableOpacity
                                            onPress={() => taskStatusSave()}
                                            style={{
                                                width: '20%',
                                                margin: 4,
                                                color: 'white',
                                                backgroundColor: '#0D6EFD',
                                                padding: 8,
                                                borderRadius: 4
                                            }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 15
                                            }}>Save</Text>
                                        </TouchableOpacity>
                                    }
                                </View>

                            </View> */}

                        {/* <View style={{
                                width: '98%',
                                padding: 12,
                                margin: 8,
                                backgroundColor: '#F8F8FF',
                                borderRadius: 4
                            }}>


                                <View>
                                    <Text style={{
                                        color: 'black'
                                    }}>upload files</Text>
                                </View>

                                <View style={{
                                    width: '100%'
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <View>
                                            <TouchableOpacity onPress={handleFileSelection} style={{
                                                width: 'auto',
                                                margin: 4,
                                                color: 'white',
                                                backgroundColor: '#EFEFEF',
                                                padding: 8,
                                                borderRadius: 4
                                            }}>
                                                <Text style={{
                                                    color: 'black',
                                                    fontSize: 15
                                                }}>Choose file</Text>
                                            </TouchableOpacity>
                                            {
                                                selectedFile ? <Text>{selectedFile[0].name}</Text> :
                                                    <Text>No File Chosen</Text>
                                            }
                                        </View>

                                        {
                                            viewImage &&
                                            <TouchableOpacity onPress={getImage} style={{
                                                width: '30%',
                                                margin: 4,
                                                color: 'white',
                                                backgroundColor: '#0D6EFD',
                                                padding: 8,
                                                borderRadius: 4
                                            }}>
                                                <Text style={{
                                                    color: 'white',
                                                    fontSize: 15
                                                }}>View Image</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={[styles.inputContainer]}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder='Enter description'
                                            onChangeText={text => setFileDescription(text)}
                                            value={fileDescription}
                                        />
                                    </View>
                                    {
                                        selectedFile && fileDescription &&
                                        <TouchableOpacity onPress={handleUpload} style={{
                                            width: '20%',
                                            margin: 4,
                                            color: 'white',
                                            backgroundColor: '#FFC107',
                                            padding: 8,
                                            borderRadius: 4
                                        }}>
                                            <Text style={{
                                                color: 'black',
                                                fontSize: 15
                                            }}>Upload</Text>
                                        </TouchableOpacity>

                                    }
                                </View>

                            </View> */}
                    </>
                    {/* } */}

                    {/* {
                        userAttendance && userAttendance[0].type === 'OUT' &&

                        <View style={{
                            margin: 8
                        }}>
                            <Text style={{
                                color: 'red',
                                fontWeight: 'bold'
                            }}>You need to check in to update tasks</Text>
                        </View>
                    } */}


                    <View style={{
                        width: '100%',
                        paddingHorizontal: 6,
                        backgroundColor: '#F1F1FB',
                    }}>

                        <View>
                            <Text style={{
                                color: 'black',
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>Task timeline</Text>
                        </View>
                        {
                            taskHistory?.length == 0 || taskHistory === null &&
                            <View>
                                <Text style={{
                                    color: 'red', fontWeight: 'bold'
                                }}>no activity to show</Text>
                            </View>
                        }

                        {
                            finalTaskHistory?.length > 0 &&

                            <View style={{
                                width: '100%',
                                marginTop: 20,
                                backgroundColor: '#F1F1FB',
                                padding: 8,
                                marginLeft: 24,
                                borderLeftWidth: 2, borderLeftColor: '#ff1010',
                                position: 'relative'

                            }}>

                                {
                                    finalTaskHistory.map((history, index) => {
                                        const scheduledOn = new Date(history.task_scheduledon);
                                        const createdOn = new Date(history.created_on);
                                        const timeDifferenceMs = createdOn - scheduledOn;
                                        const hoursDifference = timeDifferenceMs / (1000 * 60 * 60); // milliseconds to hours

                                        let timeDifferenceMessage = '';
                                        let clockImage = null;

                                        if (history.task_stage === 'TASK_START') {
                                            if (hoursDifference < 0) {
                                                timeDifferenceMessage = `delayed by ${Math.abs(hoursDifference).toFixed(2)} hrs`;
                                                clockImage = require('../images/clockDelay.png');
                                            } else if (hoursDifference > 0) {
                                                timeDifferenceMessage = `earlier by ${hoursDifference.toFixed(2)} hrs`;
                                                clockImage = require('../images/clockEarly.png');
                                            }
                                        }

                                        return (
                                            <View key={index} style={{
                                                width: '60%',
                                                alignItems: 'left',
                                                margin: 12
                                            }}>
                                                <View style={{
                                                    backgroundColor: 'white',
                                                    width: 45,
                                                    height: 45,
                                                    borderRadius: 50,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    position: 'absolute',
                                                    zIndex: 2,
                                                    left: -42,
                                                    top: 20
                                                }}>
                                                    <Image style={history.task_status === 'COMPLETED' ? { width: 40, height: 40 } : null} source={getImageForStatus(history.task_stage)}></Image>
                                                    {/* time differnce  */}
                                                </View>
                                                <View style={{
                                                    backgroundColor: 'white',
                                                    // width: 45,
                                                    // height: 45,
                                                    // borderRadius: 50,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    position: 'absolute',
                                                    zIndex: 2,
                                                    left: -42,
                                                    top: 65,
                                                    padding: 4
                                                }}>
                                                    <Text>+ {Math.abs(history.timeDifference).toFixed(2)} hrs</Text>
                                                </View>
                                                <View style={{
                                                    marginLeft: 10,
                                                }}>
                                                    <View style={{
                                                        backgroundColor: 'white',
                                                        padding: 8,
                                                        margin: 4,
                                                        marginLeft: 25,
                                                    }}>
                                                        <Text style={{ color: 'black' }}>{formatDate(history.created_on)}</Text>
                                                        {history.task_stage === 'TASK_START' &&
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, padding: 4 }}>
                                                                <Image style={{ width: 25, height: 25 }} source={clockImage}></Image>
                                                                <Text style={{ color: 'black' }}>{timeDifferenceMessage}</Text>
                                                            </View>
                                                        }
                                                    </View>

                                                    <View style={{
                                                        backgroundColor: '#F0F8FF',
                                                        padding: 8,
                                                        margin: 4,
                                                        marginLeft: 25,
                                                    }}>
                                                        <Text style={{ color: 'black', fontSize: 16 }}>{history.task_stage}</Text>
                                                        <Text style={{ color: 'black', marginTop: 4 }}>{history.task_status_description}</Text>
                                                        {
                                                            history.latitude !== '' && history.longitude !== '' &&
                                                            <TouchableOpacity onPress={() => showLocation(history.latitude, history.longitude)}>
                                                                <View style={{
                                                                    flexDirection: "row",
                                                                    padding: 8,
                                                                    backgroundColor: 'white',
                                                                    justifyContent: 'space-evenly',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    <Image style={{ width: 30, height: 30 }} source={require('../images/globeLoc.png')}></Image>
                                                                    <Text style={{ color: 'black' }}>View Location</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        }
                                                    </View>

                                                    {/* added code */}
                                                    {/* Check if the property exists and its value is 'Y' */}
                                                    {history.hasOwnProperty('name_of_file_uploaded') && history.name_of_file_uploaded === 'Y' &&
                                                        <TouchableOpacity onPress={() => getImage(history.id)} style={{
                                                            position: 'absolute',
                                                            right: -100, // Adjust this value as needed
                                                            top: 3, // Adjust this value as needed
                                                            backgroundColor: 'black', // Example background color
                                                            padding: 8,
                                                            borderRadius: 4
                                                        }}>
                                                            {/* Content for the additional view */}
                                                            <Text style={{ color: 'white' }}>View Image</Text>
                                                        </TouchableOpacity>
                                                    }

                                                    <View></View>
                                                </View>
                                            </View>
                                        );
                                    })
                                }


                            </View>
                        }

                    </View>



                </View>
            </ScrollView>

            {/* imgPop */}
            {
                viewImgPop &&

                <View style={styles.ViewImgModalWrapper}>
                    <View style={styles.ViewImgModal}>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 8
                        }}>
                            <Text style={{
                                padding: 8,
                                margin: 4,
                                color: 'black',
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>File Details</Text>

                            <TouchableOpacity onPress={() => setImagePoP(false)}>
                                <Image style={{ width: 30, height: 30 }} source={require('../images/closeIcon.png')}></Image>
                            </TouchableOpacity>
                        </View>

                        <ScrollView vertical={true}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                marginTop: 12,
                                marginBottom: 12
                            }}>

                                {
                                    modifiedImgData && modifiedImgData.map((item, index) => (
                                        <View style={{
                                            width: '40%',
                                            margin: 4,
                                            justifyContent: "center",
                                            alignItems: 'center',

                                            // borderColor: 'red',
                                            // borderWidth: 2
                                        }} key={index}>
                                            <Image source={{ uri: item.Imagepath }} style={{ width: '100%', height: 200, }}></Image>
                                            <Text>{item.Description ? item.Description : ""}</Text>
                                        </View>
                                    ))
                                }

                            </View>
                        </ScrollView>


                    </View>
                </View>
            }

            {/* locationPop */}
            {
                showLocationPop &&

                <View style={styles.ViewImgModalWrapper}>
                    <View style={styles.ViewImgModal}>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 8
                        }}>
                            <Text style={{
                                padding: 8,
                                margin: 4,
                                color: 'black',
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>Location Details</Text>

                            <TouchableOpacity onPress={() => setShowLocationPop(false)}>
                                <Image style={{ width: 30, height: 30 }} source={require('../images/closeIcon.png')}></Image>
                            </TouchableOpacity>
                        </View>

                        <ScrollView vertical={true}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                marginTop: 12,
                                marginBottom: 12
                            }}>


                            </View>
                        </ScrollView>


                    </View>
                </View>
            }

        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    TaskHomeWrapper: {
        flex: 1,
        alignItems: "center",
        backgroundColor: 'white'
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
        top: '15%',
        left: '6%',
        width: '90%',
        height: '70%',
        borderRadius: 8
    }
})

export default TaskDetails