import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StackedBarChart, YAxis, XAxis } from 'react-native-svg-charts';
import axios from 'axios';
import Test2 from './Test2';
// import { StackedBarChart } from 'react-native-chart-kit';


const TaskStatisticsChart = () => {
    const [selectedDate, setSelectedDate] = useState('')

    const [employeeData, setEmployeeData] = useState([]);

    const [fromDate, setSelectedFromDate] = useState('1900-01-01')
    const [toDate, setSelectedToDate] = useState('1900-01-01')

    const [dummyTrigger, setDummyTrigger] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setEmployeeData([])
            try {
                console.log(`https://cubixweberp.com:156/api/CRMTaskCount/CPAYS/creator/all/-/${fromDate}/${toDate}`)
                const response = await axios.get(`https://cubixweberp.com:156/api/CRMTaskCount/CPAYS/creator/all/-/${fromDate}/${toDate}`);
                setEmployeeData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [fromDate, toDate, dummyTrigger]);

    const excludedKeys = ['EMPID', 'NAME', 'DEPT', 'JOB_TITLE'];

    const dataTypes = [
        'TOTAL_ASSIGNED',
        'PENDING',
        'ACCEPTED_OPEN',
        'ACCDEPTED_HOLD',
        'TRAVEL',
        'ESCALATED',
        'TASK_PROCESS',
        'CUSTOMER_REJECTION',
        'COMPLETED',
    ];


    const colors = [
        '#8A8D90',
        '#000000',
        '#7CC674',
        '#8BC1F7',
        '#F4B678',
        '#F4C145',
        '#5752D1',
        '#C9190B',
        '#38812F',
    ];

    // Extract EMPID values as an array of strings
    const empIds = employeeData?.map(employee => employee.EMPID);

    // Collect data for each employee
    const employeeChartData = employeeData?.map(employee => {
        // For each employee, collect the values corresponding to data types
        return dataTypes.map(dataType => employee[dataType]);
    });

    // Prepare data for StackedBarChart
    const chartData = employeeData.map(employee => {
        const obj = {
            empId: employee.EMPID, // Using EMPID as a unique identifier for each employee
        };
        dataTypes.forEach(type => {
            obj[type] = employee[type];
        });
        return obj;
    });

    // Transpose the data
    const transposedData = dataTypes.map(dataType => {
        return {
            name: dataType,
            data: employeeData.map(employee => ({
                EMPID: employee.EMPID,
                value: employee[dataType]
            }))
        };
    });


    // Function to handle selection of date item
    // const handleDateSelection = (date) => {
    //     setSelectedDate(date);
    // };

    const handleDateSelection = (selection) => {
        setSelectedDate(selection);
        let fromDate, toDate;
        const today = new Date();
        switch (selection) {
            case 'Today':
                fromDate = toDate = today;
                break;
            case 'Week':
                fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // Start of the current week
                toDate = today;
                break;
            case 'Month':
                fromDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the current month
                toDate = today;
                break;
            case 'Quarter':
                console.log('quarterMnth')
                const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
                fromDate = new Date(today.getFullYear(), quarterStartMonth, 1); // Start of the current quarter
                toDate = today;
                break;
            default:
                break;
        }
        // Function to format date to "YYYY-MM-DD" format
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Format fromDate and toDate
        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);

        // Update state with formatted dates
        setSelectedFromDate(formattedFromDate);
        setSelectedToDate(formattedToDate);

        // Toggle dummyTrigger to force useEffect to run
        setDummyTrigger(prevState => !prevState);
    };


    // Function to apply default styles to date items
    const getDefaultDateItemStyle = () => {
        return {
            padding: 4,
            margin: 4,
            backgroundColor: '#F5F5F5',
            borderRadius: 4,
        };
    };

    // Function to apply selected styles to date items
    const getSelectedDateItemStyle = () => {
        return {
            backgroundColor: 'white',
            padding: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 5, // For Android
        };
    };


    // Function to combine default and selected styles based on date selection
    const getDateItemStyle = (date) => {
        const defaultStyle = getDefaultDateItemStyle();
        const selectedStyle = selectedDate === date ? getSelectedDateItemStyle() : {};
        return { ...defaultStyle, ...selectedStyle };
    };


    // console.log('employeeData', employeeData)
    // console.log('chartData', chartData)

    return (
        <View style={{
            height: 500, padding: 12, backgroundColor: 'white', width: '94%', marginBottom: 14, shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 5,
        }}>
            <View>
                <Text style={{ color: "black", fontSize: 18, fontWeight: 'bold' }}>Task Statistics</Text>
            </View>

            {/* date toggler */}
            <View style={{
                flexDirection: 'row',
                justifyContent: "flex-end",
                padding: 8,
                margin: 4
            }}>
                <View style={{
                    backgroundColor: '#F5F5F5',
                    // padding: 4,
                    borderRadius: 4,
                    flexDirection: 'row',
                    width: 'auto'
                }}>
                    <TouchableOpacity style={getDateItemStyle('Today')} onPress={() => handleDateSelection('Today')}>
                        <Text>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={getDateItemStyle('Week')} onPress={() => handleDateSelection('Week')}>
                        <Text>Week</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={getDateItemStyle('Month')} onPress={() => handleDateSelection('Month')}>
                        <Text>Month</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={getDateItemStyle('Quarter')} onPress={() => handleDateSelection('Quarter')}>
                        <Text>Quarter</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* date toggler */}

            {/* legend */}
            <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginBottom: 12
            }}>
                {
                    dataTypes.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', margin: 2, padding: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, marginRight: 4 }}>{item}</Text>
                            <View style={{ width: 14, height: 14, backgroundColor: colors[index], borderRadius: 20 }} />
                        </View>
                    ))
                }
            </View>
            {/* legend */}


            <ScrollView vertical={true} nestedScrollEnabled={true}>
                <View style={styles.container}>
                    {
                        employeeData.length === 0 &&
                        <View style={{ width: '100%:', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    }
                    {/* Y-axis */}
                    <View style={styles.yAxis}>
                        {employeeData.map(item => (
                            <Text key={item.EMPID} style={styles.yAxisItem}>{item.EMPID}</Text>
                        ))}
                    </View>
                    {/* Stacked bars */}

                    <ScrollView horizontal={true}>
                        <View style={styles.chartContainer}>
                            {employeeData.map(item => (
                                <View key={item.EMPID} style={styles.row}>
                                    {Object.keys(item)
                                        .filter(key => !excludedKeys.includes(key)) // Exclude specified keys
                                        .map((key, index) => {
                                            const value = item[key];
                                            const width = value === 0 ? 0 : value + 50; // Calculate width
                                            // const width = value * 4; // Calculate width
                                            return (
                                                <View
                                                    key={key}
                                                    style={[styles.bar, { width, backgroundColor: colors[index] }]}
                                                >
                                                    <Text style={styles.barText}>{value}</Text>
                                                </View>
                                            );
                                        }
                                        )}
                                </View>
                            ))}
                            {/* bottom scale */}
                        </View>

                    </ScrollView>
                </View>
            </ScrollView>

            {/* <Test2 data={employeeData} /> */}

            {/* {
                    chartData &&
                    <View style={{ flexDirection: 'row', height: 400 }}>
                        <YAxis
                            data={chartData.map(item => item.empId)}
                            style={{ marginBottom: 10 }}
                            contentInset={{ top: 10, bottom: 10 }}
                            formatLabel={(value, index) => chartData[index].empId}
                            svg={{ fontSize: 12, fill: 'black' }}
                            numberOfTicks={10}
                        />
                        <View style={{ flex: 1 }}>
                            <StackedBarChart
                                style={{ flex: 1 }}
                                keys={dataTypes}
                                colors={colors}
                                data={chartData}
                                showGrid={false}
                                contentInset={{ top: 30, bottom: 30 }}
                                horizontal={true}
                            />
                            <XAxis
                                style={{ marginHorizontal: -10 }}
                                data={chartData.map(item => item.empId)}
                                formatLabel={(value, index) => chartData[index].empId}
                                contentInset={{ left: 10, right: 10 }}
                                svg={{ fontSize: 12, fill: 'black' }}
                            />
                        </View>
                    </View>
                } */}

            {/* <ScrollView horizontal={true}>
                    <StackedBarChart
                        data={{
                            labels: empIds,
                            // legend: dataTypes,
                            data: employeeChartData,
                            barColors: colors
                        }}
                        width={1000}
                        height={500}
                        yAxisLabel={""}
                        chartConfig={{
                            backgroundColor: "white",
                            backgroundGradientFrom: "white",
                            backgroundGradientTo: "white",
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `black`,
                            labelColor: (opacity = 1) => `black`,
                            style: {
                                borderRadius: 16
                            }
                        }}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                </ScrollView> */}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    yAxis: {
        marginRight: 8,
        justifyContent: 'space-between',
        marginBottom: 14
    },
    yAxisItem: {
        marginBottom: 4,
    },
    chartContainer: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 14,
    },
    bar: {
        // marginRight: 4,
        justifyContent: 'center',
        alignItems: 'center',
        // borderTopLeftRadius: 4,
        // borderBottomLeftRadius: 4,
    },
    barText: {
        color: 'white',
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
});


export default TaskStatisticsChart