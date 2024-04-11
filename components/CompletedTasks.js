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



const CompletedTasks = () => {

    const [allTaskData, setAllTaskData] = useState(null)

    const navigation = useNavigation()

    const fetchAllTasks = async () => {
        try {
            const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskMainList/CPAYS/all/-/-/-/-/-/2024-01-10/2024-03-28/-`)
            if (response.status === 200) {
                const filteredTasks = response.data.filter(task => task.latest_status === 'COMPLETED');
                setAllTaskData(filteredTasks)
            }
        } catch (error) {
            console.log('allTaskApierr', error)
        }
    }

    useEffect(() => {
        fetchAllTasks()
    }, [])

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


    return (
        <SafeAreaView>
            <Header />

            <View style={{
                width: '100%',
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

                        <ScrollView nestedScrollEnabled={true}>

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

            </View>
        </SafeAreaView>
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