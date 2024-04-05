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


const Home = () => {

    const navigation = useNavigation()

    const [allTaskData, setAllTaskData] = useState(null)

    const [showNewTask, setShowNewTask] = useState(false)

    const [showProjectList, setShowProjectList] = useState(false)

    const [showNewProject, setShowNewProject] = useState(false)

    useEffect(() => {
        const fetchAllTasks = async () => {
            try {
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainList/CPAYS/all/-/-/-/-/-/2024-01-10/2024-03-28/-`)
                if (response.status === 200) {
                    setAllTaskData(response.data)
                }
            } catch (error) {
                console.log('allTaskApierr', error)
            }
        }
        fetchAllTasks()
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
                        <TouchableOpacity style={{
                            width: 100,
                            height: 100,
                            margin: 8,
                        }}>
                            <ImageBackground style={{ height: '100%' }} source={require('../images/work_card.png')}>
                                <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ALL</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: 100,
                            height: 100,
                            margin: 8,
                        }}>
                            <ImageBackground style={{ height: '100%' }} source={require('../images/ticket_card.png')}>
                                <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ACCEPTED OPEN</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: 100,
                            height: 100,
                            margin: 8,
                        }}>
                            <ImageBackground style={{ height: '100%' }} source={require('../images/schedule_card.png')}>
                                <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ACCEPT PENDING</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: 100,
                            height: 100,
                            margin: 8,
                        }}>
                            <ImageBackground style={{ height: '100%' }} source={require('../images/schedule_card.png')}>
                                <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ACCEPT EXCEEDED</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: 100,
                            height: 100,
                            margin: 8,
                        }}>
                            <ImageBackground style={{ height: '100%' }} source={require('../images/schedule_card.png')}>
                                <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ACCEPTED ON HOLD</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: 100,
                            height: 100,
                            margin: 8,
                        }}>
                            <ImageBackground style={{ height: '100%' }} source={require('../images/schedule_card.png')}>
                                <Text style={{ color: 'white', padding: 4, fontSize: 16, fontWeight: 'bold' }}>ESCALATED</Text>
                            </ImageBackground>
                        </TouchableOpacity>


                    </ScrollView>
                </View>
                {/* stages */}


                {/* allTaskTable */}
                <ScrollView vertical={true} style={{
                    marginTop: 8,
                    backgroundColor: 'white'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: "center",
                        padding: 8
                    }}>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>All Task</Text>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 8,
                            backgroundColor: '#F8F9FA'
                        }}>
                            <Image style={{ height: 30, width: 30 }} source={require('../images/filterIcon.png')}></Image>
                            <Text style={{ color: 'black' }}>Filter</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.TableContainer}>
                        {/* Table Header */}
                        <View style={styles.tableRow}>
                            <Text style={styles.headerCell}>Name</Text>
                            <Text style={styles.headerCell}>Status & Stage</Text>
                            <Text style={styles.headerCell}>Created on</Text>
                        </View>

                        {
                            allTaskData && allTaskData?.map((task, index) => (
                                <TouchableOpacity style={styles.tableRow} key={index} onPress={() => gotoTaskDetail(task)}>
                                    <Text style={[styles.dataCell, { justifyContent: 'space-between', flexDirection: 'row', width: '100%' }]}>
                                        <Image style={{ width: 25, height: 25, marginRight: 4 }} source={getImageForStatus(task.latest_status)}></Image>
                                        <Text>{task.task_name}</Text>
                                    </Text>
                                    <Text style={styles.dataCell}>{task.latest_status}</Text>
                                    <Text style={styles.dataCell}>{dayjs(task.created_on).format('DD/MM/YYYY')}</Text>
                                </TouchableOpacity>
                            ))
                        }

                    </View>
                </ScrollView>

                {
                    allTaskData === null &&
                    <ActivityIndicator color='blue' size='large'></ActivityIndicator>
                }
                {/* allTaskTable */}

                {/* statisticChart */}
                {/* <TaskStatisticsChart /> */}
                {/* statisticChart */}

            </View >

            {
                showNewTask &&
                <AddNewTask onClose={() => setShowNewTask(false)} />
            }

            {
                showProjectList &&
                <ProjectList onClose={() => setShowProjectList(false)} />
            }

            {
                showNewProject &&
                <NewProject onClose={() => setShowNewProject(false)} />
            }
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    HomeContainer: {
        flex: 1
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
        marginTop: 2
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
})

export default Home