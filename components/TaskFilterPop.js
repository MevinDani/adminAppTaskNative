import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native'
import React, { useState } from 'react'
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


const TaskFilterPop = () => {

    const [activeOption, setActiveOption] = useState('All');

    const [activePriority, setActivePriority] = useState('All')

    const handleOptionClick = (option) => {
        setActiveOption(option);
    };

    const handlePriorityClick = (priority) => {
        setActivePriority(priority)
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
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    useState(() => {
        setFromDate(twoDaysAgo);
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

    console.log('fromDate', fromDate)
    console.log('toDate', toDate)
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
                    <TouchableOpacity style={{
                        padding: 8,
                        backgroundColor: '#6C757D',
                        borderRadius: 4
                    }}>
                        <Text style={{ color: 'white' }}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    margin: 4
                }}>
                    <Text style={{ color: '#413E52' }}>status & stage</Text>
                </View>

                {/* OptionsToggler */}
                <View style={styles.OptionsTogglerWrapper}>

                    <View style={styles.OptionToggleContainer}>

                        <View style={[styles.OptionImgViewCont, activeOption === 'All' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handleOptionClick('All')}>
                                <Text>All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.OptionImgViewCont, activeOption === 'TaskOpen' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handleOptionClick('TaskOpen')}>
                                <Image source={TaskOpen} style={styles.OptionSvg}></Image>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.OptionImgViewCont, activeOption === 'Triangle' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handleOptionClick('Triangle')}>
                                <Image source={Triangle} style={styles.OptionSvg} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.OptionImgViewCont, activeOption === 'TaskHold' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handleOptionClick('TaskHold')}>
                                <Image source={TaskHold} style={styles.OptionSvg} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.OptionImgViewCont, activeOption === 'TaskEscalated' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handleOptionClick('TaskEscalated')}>
                                <Image source={TaskEscalated} style={styles.OptionSvg} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.OptionImgViewCont, activeOption === 'TravelStart' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handleOptionClick('TravelStart')}>
                                <Image source={TravelStart} style={styles.OptionSvg} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.OptionImgViewCont, activeOption === 'TravelEnd' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handleOptionClick('TravelEnd')}>
                                <Image source={TravelEnd} style={styles.OptionSvg} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.OptionImgViewCont, activeOption === 'TaskStart' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handleOptionClick('TaskStart')}>
                                <Image source={TaskStart} style={styles.OptionSvg} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.OptionImgViewCont, activeOption === 'TaskEnd' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handleOptionClick('TaskEnd')}>
                                <Image source={TaskEnd} style={styles.OptionSvg} />
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>


                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    margin: 4,
                    marginTop: 12
                }}>
                    <Text style={{ color: '#413E52' }}>priority</Text>
                </View>

                {/* OptionsToggler */}
                <View style={styles.OptionsTogglerWrapper}>

                    <View style={styles.OptionToggleContainer}>

                        <View style={[styles.OptionImgViewCont, activePriority === 'All' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handlePriorityClick('All')}>
                                <Text>All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.OptionImgViewCont, activePriority === 'Low' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handlePriorityClick('Low')}>
                                <Image source={LowP} style={styles.OptionSvg}></Image>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.OptionImgViewCont, activePriority === 'Moderate' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handlePriorityClick('Moderate')}>
                                <Image source={Moderate} style={styles.OptionSvg} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.OptionImgViewCont, activePriority === 'High' && styles.activeOption]}>
                            <TouchableOpacity onPress={() => handlePriorityClick('High')}>
                                <Image source={High} style={styles.OptionSvg} />
                            </TouchableOpacity>
                        </View>
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
                        <Button title="Date Picker" onPress={showFromDatePicker} />
                        <DateTimePickerModal
                            isVisible={isFromDatePickerVisible}
                            mode="date"
                            date={fromDate}
                            onConfirm={handleFromDateConfirm}
                            onCancel={hideFromDatePicker}
                        />
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#413E52' }}>To</Text>
                        <Button title="Date Picker" onPress={showToDatePicker} />
                        <DateTimePickerModal
                            isVisible={isToDatePickerVisible}
                            mode="date"
                            onConfirm={handleToDateConfirm}
                            onCancel={hideToDatePicker}
                        />
                    </View>
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
        height: 500
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

})

export default TaskFilterPop