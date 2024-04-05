import React from 'react';
import { View } from 'react-native';
import { StackedBarChart } from 'react-native-svg-charts';

const TaskStatisticsChart = () => {
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

    const colors = ['#7b4173', '#a55194', '#ce6dbd', '#de9ed6'];

    const keys = ['apples', 'bananas', 'cherries', 'dates'];

    return (
        <View style={{ height: 200, padding: 20 }}>
            <StackedBarChart
                style={{ flex: 1 }}
                keys={keys}
                colors={colors}
                data={data}
                showGrid={false}
                contentInset={{ top: 30, bottom: 30 }}
            />
        </View>
    );
};


export default TaskStatisticsChart