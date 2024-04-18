import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from './Header'
import axios from 'axios'
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
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import TaskFilterPop from './TaskFilterPop'
import AsyncStorage from '@react-native-async-storage/async-storage';



const CompletedTasks = () => {

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

    const navigation = useNavigation()

    useEffect(() => {
        fetchFilteredTasks()
    }, [taskFilterData])

    const handleTaskFilterClick = (data) => {
        console.log('taskFilterData', data)
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

    // useEffect(() => {
    //     fetchFilteredTasks()
    //     // if (status !== 'all' || priority !== 'all' || fromDate !== '1900-01-01' || toDate !== '1900-01-01' || EmpIdF !== 'all' || dept !== 'all' || searchTerm !== '-') {
    //     // }
    // }, [status, priority, fromDate, toDate, EmpIdF, dept, searchTerm])

    // console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)

    const fetchFilteredTasks = async () => {
        setShowFilterActivity(true)
        console.log('taskFilterDataFromFilterApi', taskFilterData)
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


    const fetchCompletedTasks = async () => {
        console.log('fetchCompletedTasks called')
        try {
            if (taskUrl === 'SUPERADMIN') {
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/all/-/all/all/all/1900-01-01/1900-01-01/-/all/1`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            } else if (taskUrl === 'COORDINATOR') {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/1`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/1`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            } else if (taskUrl === 'DEPT_ADMIN') {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/1`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/1`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            }
        } catch (error) {
            console.log('fetchCompletedTasksErr', error)
        }
        // try {
        //     const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainList/CPAYS/all/-/-/-/-/-/2024-01-10/2024-03-28/-`)
        //     if (response.status === 200) {
        //         const filteredTasks = response.data.filter(task => task.latest_status === 'COMPLETED');
        //         setAllTaskData(filteredTasks)
        //     }
        // } catch (error) {
        //     console.log('allTaskApierr', error)
        // }
    }

    // useEffect(() => {
    //     if (userData) {
    //         fetchCompletedTasks()
    //     }
    // }, [userData])

    useEffect(() => {
        if (userData && taskUrl !== '') {
            fetchCompletedTasks()
        }
    }, [userData, taskUrl])

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

                if (userData) {
                    if (userData.onlineallow === 'SUPERADMIN') {
                        setTaskUrl('SUPERADMIN')
                    } else {
                        setTaskUrl(userData.onlineallow)
                    }
                }

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    console.log('userData', userData)

    useEffect(() => {
        if (userData) {
            if (userData.onlineallow === 'SUPERADMIN') {
                setTaskUrl('SUPERADMIN')
            } else {
                setTaskUrl(userData.onlineallow)
            }
        }

    }, [userData])

    const hardReset = async () => {
        setShowFilterActivity(true)
        console.log('taskUrl-hardReset', taskUrl)
        try {
            if (taskUrl === 'SUPERADMIN') {
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/all/-/all/all/all/1900-01-01/1900-01-01/-/all/1`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            } else if (taskUrl === 'COORDINATOR') {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/1`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/creator/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/1`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            } else if (taskUrl === 'DEPT_ADMIN') {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/1`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/dept/${userData.Division}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/1`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            }
        } catch (error) {
            console.log('hardResetErr', error)
        }
    }

    const gotoTaskDetail = (task) => {
        navigation.navigate('TaskDetails', {
            task_id: task.task_id,
            created_on: task.created_on,
            task_scheduledon: task.task_scheduledon
        });
    };

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

    console.log('allTaskData', allTaskData)
    console.log(showFilterActivity)


    return (
        <SafeAreaView style={{
            backgroundColor: '#E6E6FA'
        }}>
            <Header />

            <View style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                marginTop: 24
            }}>
                <View style={{
                    // marginTop: 8,
                    backgroundColor: 'white',
                    marginBottom: 24, width: '96%'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: "center",
                        padding: 8
                    }}>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>Completed Task</Text>
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
                                // allTaskData === null &&
                                showFilterActivity &&
                                <ActivityIndicator color='blue' size='large'></ActivityIndicator>
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
                                            <Image style={{ width: 25, height: 25, marginRight: 12 }} source={getImageForStatus(task.latest_status)}></Image>
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

            </View>
            {
                showTaskFilter &&
                <TaskFilterPop onFilter={handleTaskFilterClick} onClose={() => setShowTaskFilter(false)} />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    HomeContainer: {
        flex: 1,
        backgroundColor: '#E6E6FA',
    },
    projectTask: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        padding: 14,
        backgroundColor: 'white',
        borderRadius: 4,
        flex: 1,
    },
    projectImg: {
        width: 40,
        height: 40
    },
    TableContainer: {
        width: "100%",
        padding: 10,
        marginTop: 2,
        maxHeight: 500
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
})

export default CompletedTasks