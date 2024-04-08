import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

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

const TaskStatisticsChart = ({ data }) => {

    // console.log('data', data)
    const excludedKeys = ['EMPID', 'NAME', 'DEPT', 'JOB_TITLE']; // Define keys to exclude

    return (
        <View style={styles.container}>
            {
                data.length === 0 &&
                <View style={{ width: '100%:', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            }
            {/* Y-axis */}
            <View style={styles.yAxis}>
                {data.map(item => (
                    <Text key={item.EMPID} style={styles.yAxisItem}>{item.EMPID}</Text>
                ))}
            </View>
            {/* Stacked bars */}

            <ScrollView horizontal={true}>
                <View style={styles.chartContainer}>
                    {data.map(item => (
                        <View key={item.EMPID} style={styles.row}>
                            {Object.keys(item)
                                .filter(key => !excludedKeys.includes(key)) // Exclude specified keys
                                .map((key, index) => {
                                    const value = item[key];
                                    const width = value === 0 ? 25 : value + 80; // Calculate width
                                    // const width = value * 8; // Calculate width
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

export default TaskStatisticsChart;
