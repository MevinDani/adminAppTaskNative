import { View, Text, StyleSheet, TouchableOpacity, Image, Button, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import TaskOpen from '../images/task_open.png'
import Triangle from '../images/triangle_in_path.png'
import TaskHold from '../images/task_end_in_path.png'
import TaskEscalated from '../images/escalated.png'
import TravelStart from '../images/travel_start_in_path.png'
import TravelEnd from '../images/travel_end_in_path.png'
import TaskStart from '../images/task_start_in_path.png'
import TaskEnd from '../images/task_end.png'
import LowP from '../images/low_priority.png'
import Moderate from '../images/medium_priority.png'
import High from '../images/high_priority.png'
import completed from '../images/ic_check_scanned_button.png'
import beyondScope from '../images/task_end_in_path.png'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios'


const TaskFilterPop = ({ onClose, onFilter }) => {

    const [activeOption, setActiveOption] = useState('all');

    const [activePriority, setActivePriority] = useState('all')

    const [searchTerm, setSearchTerm] = useState('')

    const [taskStageList, setTaskStageList] = useState(null)

    const [codeValue, setCodeValue] = useState('');

    const handleOptionClick = (option) => {
        setActiveOption(option);
    };

    const handlePriorityClick = (priority) => {
        setActivePriority(priority)
    }

    const [showEmpIdList, setShowEmpIdList] = useState(false)

    const [selectedEmpId, setSelectedEmpId] = useState('')

    const [empIdData, setEmpIdData] = useState(null)

    const handleshowEmpIdList = async () => {
        setShowEmpIdList(!showEmpIdList)
        try {
            const response = await axios.get(`https://cubixweberp.com:156/api/PersonalInfoList/CPAYS/ALL/YES/ALL/ALL/ALL/ALL`)
            if (response.status === 200) {
                setEmpIdData(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleEmpIdSelect = (EmpId) => {
        setShowEmpIdList(false)
        setSelectedEmpId(EmpId)
    }

    const [showDepIdList, setShowDepIdList] = useState(false)

    const [selectedDept, setSelectedDept] = useState('')

    const [DepIdData, setDepIdData] = useState(null)

    const handleshowDepIdList = async () => {
        setShowDepIdList(!showDepIdList)
        try {
            const response = await axios.get(`https://cubixweberp.com:156/api/MASTERLIST/CPAYS/DIVISION`)
            if (response.status === 200) {
                setDepIdData(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeptSelect = (Dept) => {
        setShowDepIdList(false)
        setSelectedDept(Dept)
    }

    // date


    const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
    const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);

    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')


    const showFromDatePicker = () => {
        setFromDatePickerVisibility(true);
    };

    const showToDatePicker = () => {
        setToDatePickerVisibility(true);
    };

    const hideFromDatePicker = () => {
        setFromDatePickerVisibility(false);
    };
    const hideToDatePicker = () => {
        setToDatePickerVisibility(false);
    };

    // Calculate two days before the current date
    // const twoDaysAgo = new Date();
    // twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // useState(() => {
    //     setFromDate(twoDaysAgo);
    // }, []);

    useEffect(() => {
        // Calculate two days before the current date
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const today = new Date()

        // Extract date part
        const year = twoDaysAgo.getFullYear();
        const month = String(twoDaysAgo.getMonth() + 1).padStart(2, '0');
        const day = String(twoDaysAgo.getDate()).padStart(2, '0');

        // Formatted date in yyyy-MM-dd format
        const formattedDate = `${year}-${month}-${day}`;
        // Extract date part
        const Tyear = today.getFullYear();
        const Tmonth = String(today.getMonth() + 1).padStart(2, '0');
        const Tday = String(today.getDate()).padStart(2, '0');

        // ForTmatted date in yyyy-MM-dd format
        const TformattedDate = `${Tyear}-${Tmonth}-${Tday}`;

        // Set the fromDate state to two days ago in formatted date string format when the component mounts
        if (formattedDate) setFromDate(formattedDate);

        if (TformattedDate) setToDate(TformattedDate)
    }, []);



    const handleFromDateConfirm = (date) => {
        console.warn("From has been picked: ", date);

        // Create a new Date object with only year, month, and day
        // const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        // console.log('selectedDate', selectedDate)

        // setFromDate(selectedDate); // Set the fromDate to the selected Date object without the time part
        // hideFromDatePicker();

        // // Extract date part
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // // Formatted date in yyyy-MM-dd format
        const formattedDate = `${year}-${month}-${day}`;

        setFromDate(formattedDate);
        hideFromDatePicker();
    };
    const handleToDateConfirm = (date) => {
        console.warn("To has been picked: ", date);

        // Extract date part
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // Formatted date in yyyy-MM-dd format
        const formattedDate = `${year}-${month}-${day}`;

        setToDate(formattedDate);
        hideToDatePicker();
    };

    const handleReset = () => {
        setActiveOption('all')
        setActivePriority('all')
        setFromDate('')
        setToDate('')
        setSelectedEmpId('')
        setSelectedDept('')
        setSearchTerm('')
    }

    useEffect(() => {
        if (activeOption !== 'all') {
            const foundCode = taskStageList?.find(code => code.code_name === activeOption);
            if (foundCode) {
                // Set the code_value state based on the matched code_name
                setCodeValue(foundCode.code_value);
            } else {
                // Handle case where no matching code_name is found
                setCodeValue('all');
            }
        }
    }, [activeOption])

    const handleFilterClick = () => {
        const data = {
            status: activeOption,
            priority: activePriority,
            fromDate: fromDate,
            toDate: toDate,
            EmpId: selectedEmpId,
            Dept: selectedDept,
            searchTerm: searchTerm,
            code: codeValue
        }

        onFilter(data)
        onClose()
    }

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


    console.log('codeValue', codeValue)
    // console.log('fromDate', fromDate)
    // console.log('toDate', toDate)
    return (
        <View style={styles.TaskFilterWrapper}>
            <View style={styles.TaskFilterCont}>

                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 4,
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Filter</Text>
                    <View style={{
                        flexDirection: 'row',
                        width: '35%',
                        justifyContent: 'space-between'
                    }}>
                        <TouchableOpacity onPress={handleReset} style={{
                            padding: 8,
                            backgroundColor: '#6C757D',
                            borderRadius: 4,
                            padding: 8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3,
                            elevation: 5,
                        }}>
                            <Text style={{ color: 'white' }}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={{
                            padding: 8,
                            backgroundColor: 'red',
                            borderRadius: 4,
                            padding: 8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3,
                            elevation: 5,
                        }}>
                            <Text style={{ color: 'white' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    margin: 4,
                    alignItems: 'center'
                }}>
                    <Text style={{ color: '#413E52' }}>status & stage</Text>
                    <Text style={{
                        backgroundColor: '#26BE96', color: 'white', borderRadius: 4, marginLeft: 12, paddingHorizontal: 12, paddingVertical: 4
                    }}>{activeOption}</Text>
                </View>

                {/* OptionsToggler */}
                <View style={styles.OptionsTogglerWrapper}>

                    <View style={styles.OptionToggleContainer}>

                        <TouchableOpacity style={[styles.OptionImgViewCont, activeOption === 'all' && styles.activeOption]} onPress={() => handleOptionClick('all')}>
                            <Text>all</Text>
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activeOption === 'all' && styles.activeOption]}>
                        </View> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activeOption === 'ACCEPTED_OPEN' && styles.activeOption]} onPress={() => handleOptionClick('ACCEPTED_OPEN')}>
                            <Image source={TaskOpen} style={styles.OptionSvg}></Image>
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activeOption === 'TaskOpen' && styles.activeOption]}>
                        </View> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activeOption === 'ACCEPT_PENDING' && styles.activeOption]} onPress={() => handleOptionClick('ACCEPT_PENDING')}>
                            <Image source={Triangle} style={styles.OptionSvg} />
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activeOption === 'Triangle' && styles.activeOption]}>
                        </View> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activeOption === 'ACCEPTED_ON_HOLD' && styles.activeOption]} onPress={() => handleOptionClick('ACCEPTED_ON_HOLD')}>
                            <Image source={TaskHold} style={styles.OptionSvg} />
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activeOption === 'TaskHold' && styles.activeOption]}>
                        </View> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activeOption === 'ESCALATED' && styles.activeOption]} onPress={() => handleOptionClick('ESCALATED')}>
                            <Image source={TaskEscalated} style={styles.OptionSvg} />
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activeOption === 'TaskEscalated' && styles.activeOption]}>
                        </View> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activeOption === 'TRAVEL_START' && styles.activeOption]} onPress={() => handleOptionClick('TRAVEL_START')}>
                            <Image source={TravelStart} style={styles.OptionSvg} />
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activeOption === 'TravelStart' && styles.activeOption]}>
                        </View> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activeOption === 'TRAVEL_END' && styles.activeOption]} onPress={() => handleOptionClick('TRAVEL_END')}>
                            <Image source={TravelEnd} style={styles.OptionSvg} />
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activeOption === 'TravelEnd' && styles.activeOption]}>
                        </View> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activeOption === 'TASK_START' && styles.activeOption]} onPress={() => handleOptionClick('TASK_START')}>
                            <Image source={TaskStart} style={styles.OptionSvg} />
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activeOption === 'TaskStart' && styles.activeOption]}>
                        </View> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activeOption === 'TASK_END' && styles.activeOption]} onPress={() => handleOptionClick('TASK_END')}>
                            <Image source={TaskEnd} style={styles.OptionSvg} />
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activeOption === 'TaskEnd' && styles.activeOption]}>
                        </View> */}

                    </View>

                </View>


                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    margin: 4,
                    marginTop: 12,
                    alignItems: 'center'
                }}>
                    <Text style={{ color: '#413E52' }}>priority</Text>
                    <Text style={{
                        backgroundColor: '#26BE96', color: 'white', borderRadius: 4, marginLeft: 12, paddingHorizontal: 12, paddingVertical: 4
                    }}>{activePriority}</Text>
                </View>

                {/* OptionsToggler */}
                <View style={styles.OptionsTogglerWrapper}>

                    <View style={styles.OptionToggleContainer}>

                        {/* <View style={[styles.OptionImgViewCont, activePriority === 'all' && styles.activeOption]}> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activePriority === 'all' && styles.activeOption]} onPress={() => handlePriorityClick('all')}>
                            <Text>all</Text>
                        </TouchableOpacity>
                        {/* </View> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activePriority === 'Low' && styles.activeOption]} onPress={() => handlePriorityClick('Low')}>
                            <Image source={LowP} style={styles.OptionSvg}></Image>
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activePriority === 'Low' && styles.activeOption]}>
                        </View> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activePriority === 'Moderate' && styles.activeOption]} onPress={() => handlePriorityClick('Moderate')}>
                            <Image source={Moderate} style={styles.OptionSvg} />
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activePriority === 'Moderate' && styles.activeOption]}>
                        </View> */}
                        <TouchableOpacity style={[styles.OptionImgViewCont, activePriority === 'High' && styles.activeOption]} onPress={() => handlePriorityClick('High')}>
                            <Image source={High} style={styles.OptionSvg} />
                        </TouchableOpacity>
                        {/* <View style={[styles.OptionImgViewCont, activePriority === 'High' && styles.activeOption]}>
                        </View> */}
                    </View>

                </View>

                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    padding: 12
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#413E52' }}>From</Text>
                        <Button title={fromDate ? fromDate : 'select from date'} onPress={showFromDatePicker} />
                        <DateTimePickerModal
                            isVisible={isFromDatePickerVisible}
                            mode="date"
                            // date={fromDate}
                            onConfirm={handleFromDateConfirm}
                            onCancel={hideFromDatePicker}
                        />
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#413E52' }}>To</Text>
                        <Button title={toDate ? toDate : 'select to date'} onPress={showToDatePicker} />
                        <DateTimePickerModal
                            isVisible={isToDatePickerVisible}
                            mode="date"
                            onConfirm={handleToDateConfirm}
                            onCancel={hideToDatePicker}
                        />
                    </View>
                </View>

                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 4,
                    padding: 8
                }}>
                    <TouchableOpacity onPress={() => handleshowEmpIdList()} style={{
                        padding: 8,
                        backgroundColor: '#6C757D',
                        borderRadius: 4
                    }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>employee</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleshowDepIdList()} style={{
                        padding: 8,
                        backgroundColor: '#6C757D',
                        borderRadius: 4
                    }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>department</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: 'white'
                }}>
                    <View style={{ width: '48%', }}>
                        {
                            showEmpIdList &&
                            <ScrollView style={{ height: 200 }}>
                                {
                                    empIdData && empIdData.map((item, index) => (
                                        <TouchableOpacity onPress={() => handleEmpIdSelect(item.EmpId)} key={index} style={{
                                            backgroundColor: 'black', margin: 1, padding: 6
                                        }}>
                                            <Text style={{ color: 'white' }}>{item.EmpId}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </ScrollView>
                        }
                        {
                            selectedEmpId &&
                            <View style={{ alignItems: 'center', justifyContent: "flex-start", width: '100%' }}>
                                <Text style={{ color: 'green', fontSize: 18, fontWeight: 'bold' }}>{selectedEmpId}</Text>
                            </View>
                        }

                    </View>

                    <View style={{ width: '48%', }}>
                        {
                            showDepIdList &&
                            <ScrollView style={{ height: 200 }}>
                                {
                                    DepIdData && DepIdData.map((item, index) => (
                                        <TouchableOpacity onPress={() => handleDeptSelect(item.Description)} key={index} style={{
                                            backgroundColor: 'black', margin: 1, padding: 6
                                        }}>
                                            <Text style={{ color: 'white' }}>{item.Description}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </ScrollView>
                        }
                        {
                            selectedDept &&
                            <View style={{ alignItems: 'center', justifyContent: "flex-end", width: '100%' }}>
                                <Text style={{ color: 'green', fontSize: 18, fontWeight: 'bold' }}>{selectedDept}</Text>
                            </View>
                        }
                    </View>
                </View>

                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setSearchTerm(text)}
                            value={searchTerm}
                            placeholder='Search'
                        />
                    </View>
                    {/* <TouchableOpacity onPress={handleFilterClick} style={{
                        backgroundColor: 'black', padding: 8, marginLeft: 4, borderRadius: 4, marginTop: 8
                    }}>
                        <Text style={{ color: 'white' }}>Filter</Text>
                    </TouchableOpacity> */}
                </View>

                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 12 }}>
                    <TouchableOpacity onPress={handleFilterClick} style={{
                        backgroundColor: 'black', padding: 8, marginLeft: 4, borderRadius: 4, marginTop: 8, width: '25%'
                    }}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Filter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    TaskFilterWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

        zIndex: 2,
        backgroundColor: '#00000080',
        position: 'absolute',
        width: '100%',
        height: '100%',
        // justifyContent: 'center',
        // alignItems: 'center',
        // top: '12%'
    },
    TaskFilterCont: {
        backgroundColor: '#F7F7F7',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '94%',
        height: 'auto'
    },


    OptionsTogglerWrapper: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12
    },
    OptionToggleContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: 'space-between',
        borderRadius: 32,
        borderWidth: 1,
        padding: 8,
        // paddingHorizontal: 12,
        // paddingVertical: 14
    },
    OptionSvg: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        paddingVertical: 12
    },
    activeOption: {
        borderTopWidth: 2,
        borderTopColor: 'blue',
    },
    OptionImgViewCont: {
        paddingTop: 8,
        margin: 4
    },
    inputContainer: {
        width: '75%',
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

})

export default TaskFilterPop