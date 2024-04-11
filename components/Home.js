import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator } from 'react-native'
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


const Home = () => {

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
            } else {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${code}`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${code}`)
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
                } else {
                    const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
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

    console.log('userData', userData)

    useEffect(() => {
        if (userData) {
            if (userData.onlineallow === 'SUPERADMIN') {
                setTaskUrl('SUPERADMIN')
            } else {
                setTaskUrl(`NOTSUPERADMIN`)
            }
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
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/all/-/all/all/all/1900-01-01/1900-01-01/-/all/all`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            } else {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${userData.empid}/-/all/all/${userData.Division}/1900-01-01/1900-01-01/-/all/all`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${userData.empid}/-/all/all/${userData.Division}/1900-01-01/1900-01-01/-/all/all`)
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
            } else {
                console.log(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainListFilter/CPAYS/all/${userData.empid}/-/all/all/${userData.Division}/${fromDate}/${toDate}/${searchTerm}/${priority}/${status}`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                    setShowFilterActivity(false)
                }
            }
        } catch (error) {
            console.log('fetchAllTasksErr', error)
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
            task_scheduledon: task.task_scheduledon
        });
    };

    // console.log('allTaskData', allTaskData)
    return (
        <SafeAreaView style={styles.HomeContainer}>
            <ToastManager />

            <ScrollView vertical={true}>

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
                        marginBottom: 24, width: '96%'
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
                                    <Image style={{ height: 30, width: 30 }} source={require('../images/filterIcon.png')}></Image>
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
                                    allTaskData === null &&
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
                    {/* allTaskTable */}

                    {/* statisticChart */}
                    <TaskStatisticsChart />
                    {/* statisticChart */}



                </View >

            </ScrollView>

            {
                showNewTask &&
                <AddNewTask onClose={() => setShowNewTask(false)} fetchAllTasks={fetchAllTasks} />
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
})

export default Home