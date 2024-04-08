import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
// import { StackedBarChart, YAxis, XAxis } from 'react-native-svg-charts';
import axios from 'axios';
import { StackedBarChart } from 'react-native-chart-kit';


const TaskStatisticsChart = () => {
    const [selectedDate, setSelectedDate] = useState('')

    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://cubixweberp.com:156/api/CRMTaskCount/CPAYS/creator/all/-/1900-01-01/1900-01-01');
                setEmployeeData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

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
        '#3498db',
        '#2ecc71',
        '#f1c40f',
        '#e74c3c',
        '#9b59b6',
        '#1abc9c',
        '#34495e',
        '#f39c12',
        '#c0392b',
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
    const handleDateSelection = (date) => {
        setSelectedDate(date);
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

    const data = [
        {
            month: new Date(2024, 0, 1),
            apples: 3840,
            bananas: 1920,
            cherries: 960,
            dates: 400,
        },
        {
            month: new Date(2024, 1, 1),
            apples: 1600,
            bananas: 1440,
            cherries: 960,
            dates: 400,
        },
        {
            month: new Date(2024, 2, 1),
            apples: 640,
            bananas: 960,
            cherries: 3640,
            dates: 400,
        },
        {
            month: new Date(2024, 3, 1),
            apples: 3320,
            bananas: 480,
            cherries: 640,
            dates: 400,
        },
    ];

    // const colors = ['#7b4173', '#a55194', '#ce6dbd', '#de9ed6'];

    const keys = ['apples', 'bananas', 'cherries', 'dates'];

    // console.log('employeeData', employeeData)
    console.log('chartData', chartData)

    return (
        <View style={{ height: 600, padding: 20, backgroundColor: 'white', width: '100%' }}>
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

            {/* {
                chartData &&
                <View style={{ flexDirection: 'row', height: 400 }}>
                    <XAxis
                        data={chartData.map(item => item.empId)}
                        style={{ marginBottom: 10, marginHorizontal: -10 }}
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
                        <YAxis
                            style={{ marginBottom: 10 }}
                            data={chartData.map(item => item.empId)}
                            contentInset={{ top: 10, bottom: 10 }}
                            svg={{ fontSize: 12, fill: 'black' }}
                        />
                    </View>
                </View>
            } */}

            <ScrollView horizontal={true}>
                <StackedBarChart
                    data={{
                        labels: empIds,
                        legend: dataTypes,
                        data: employeeChartData,
                        barColors: colors
                    }}
                    width={1200} // from react-native
                    height={400}
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
            </ScrollView>

        </View>
    );
};


export default TaskStatisticsChart