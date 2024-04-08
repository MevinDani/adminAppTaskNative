import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Dimensions } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import axios from 'axios';

const TaskStatisticsChart = () => {
    const [employeeData, setEmployeeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://cubixweberp.com:156/api/CRMTaskCount/CPAYS/creator/all/-/1900-01-01/1900-01-01');
                setEmployeeData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
                setLoading(false);
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

    const getColorForDataType = (dataType) => {
        // Generate colors based on the data type
        // You can use a consistent color scheme or customize it as needed
        switch (dataType) {
            case 'TOTAL_ASSIGNED':
                return '#3498db';
            case 'PENDING':
                return '#2ecc71';
            // Add more cases for other data types
            default:
                return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error fetching data: {error.message}</Text>
            </View>
        );
    }

    const chartData = employeeData.map(employee => {
        const dataObj = {};
        dataTypes.forEach(type => {
            dataObj[type] = employee[type];
        });
        return dataObj;
    });

    // Sample data
    const data = {
        labels: ["Test1", "Test2"],
        legend: ["L1", "L2", "L3"],
        data: [[60, 60, 60], [30, 30, 60]],
        barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
    };

    // Transpose data
    const transposedData = data.data[0].map((_, colIndex) => data.data.map(row => row[colIndex]));


    // console.log(empIds)
    // console.log(employeeChartData)

    return (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Task Statistics</Text>

            {/* <StackedBarChart
                data={{
                    labels: empIds,
                    legend: dataTypes,
                    data: employeeChartData,
                    barColors: colors
                }}
                width={350}
                height={450}
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
                horizontal={true}
            /> */}

            <StackedBarChart
                data={{
                    labels: ["L1", "L2", "L3"],
                    legend: ["Test1", "Test2"],
                    data: [[60, 30], [60, 30], [60, 60]],
                    barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
                }}
                width={Dimensions.get("window").width - 50} // from react-native
                height={220}
                yAxisLabel={"Rp"}
                chartConfig={{
                    backgroundColor: "green",
                    backgroundGradientFrom: "green",
                    backgroundGradientTo: "green",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `white`,
                    labelColor: (opacity = 1) => `white`,
                    style: {
                        borderRadius: 16
                    }
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                flip={true}
            />


            {/* <StackedBarChart
                data={{
                    labels: data.labels,
                    legend: data.legend,
                    data: transposedData,
                    barColors: data.barColors
                }}
                width={Dimensions.get("window").width - 50}
                height={220}
                yAxisLabel={"Rp"}
                chartConfig={{
                    backgroundColor: "green",
                    backgroundGradientFrom: "green",
                    backgroundGradientTo: "green",
                    decimalPlaces: 2,
                    color: (opacity = 1) => `white`,
                    labelColor: (opacity = 1) => `white`,
                    style: {
                        borderRadius: 16
                    }
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                horizontal={true}
                withCustomBarColorFromData={true}
            /> */}

        </View>
    );
};

export default TaskStatisticsChart;
