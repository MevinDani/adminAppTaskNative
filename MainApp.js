import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import Home from './components/Home';
import TaskDetails from './components/TaskDetails';
// import { createDrawerNavigator } from '@react-navigation/drawer';


const Stack = createNativeStackNavigator();

// const Drawer = createDrawerNavigator()

const MainApp = () => {

    const [userDataExists, setUserDataExists] = useState(false);

    // useEffect(() => {
    //     const checkUserData = async () => {
    //         try {
    //             const userDataJson = await AsyncStorage.getItem('userData');
    //             const userData = JSON.parse(userDataJson);
    //             setUserDataExists(userData !== null);
    //         } catch (error) {
    //             console.error('Error checking user data:', error);
    //         }
    //     };
    //     checkUserData();
    // }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
                <Stack.Screen name='TaskDetails' component={TaskDetails} options={{ headerShown: false }} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainApp