import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import location from '../images/globeLoc.png'
import { ActivityIndicator } from 'react-native';
import database from '@react-native-firebase/database';
import { Alert } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, PROVIDER_OSMDROID } from 'react-native-maps';
import mapMan from '../images/mapMan.png'
import mapManS from '../images/mapManS.png'


const EmpLocation = ({ setShowMap, showMap }) => {



    // Access data from your Firebase Realtime Database and display it in an alert whenever it updates
    // database()
    //     .ref('userLocations') // Reference to the root of your database
    //     .on('value', snapshot => {
    //         const data = snapshot.val();
    //         // Alert.alert('Updated Data', JSON.stringify(data));
    //         console.log('databaseData', data)
    //         // setDbUserLocations(data)
    //         // notifee.displayNotification({
    //         //     title: 'Updated Data',
    //         //     body: JSON.stringify(data), // Convert data to string for body
    //         // });
    //     }, error => {
    //         console.error('Error fetching data:', error);
    //         Alert.alert('Error', 'Failed to fetch data. Please try again later.');
    //     });


    useEffect(() => {
        // Function to fetch initial data from Firebase and set state
        const fetchData = async () => {
            try {
                console.log('setDbUserLocationsfetchData')
                const snapshot = await database().ref('userLocations').once('value');
                const data = snapshot.val();
                setDbUserLocations(data); // Update state with fetched data
            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to fetch data. Please try again later.');
            }
        };

        fetchData(); // Call the function

        console.log('dbUserLocations', dbUserLocations)

        // Subscription to database updates without updating state
        const onDatabaseUpdate = snapshot => {
            const data = snapshot.val();
            console.log('Database data updated:', data);
            setDbUserLocations(data); // Update state with new data
        };

        database().ref('userLocations').on('value', onDatabaseUpdate);

        // Cleanup function to remove event listener when component unmounts
        return () => {
            database().ref('userLocations').off('value', onDatabaseUpdate); // Unsubscribe from updates
        };

    }, []);




    const [dbUserLocations, setDbUserLocations] = useState(null)
    const [empIdData, setEmpIdData] = useState(null)
    const [empListLoader, setEmpListLoader] = useState(false)

    const [userLocation, setUserLocation] = useState(null)

    // const [showMap, setShowMap] = useState(false)

    const getEmpData = async () => {
        setEmpListLoader(true)
        try {
            const response = await axios.get(`https://cubixweberp.com:156/api/PersonalInfoList/CPAYS/ALL/YES/ALL/ALL/ALL/ALL`)
            if (response.status === 200) {
                setEmpIdData(response.data)
                setEmpListLoader(false)
            }
        } catch (error) {
            console.log(error)
            setEmpListLoader(false)
        }
    }

    // const handleShowMap = async (empId) => {
    //     setShowMap(true)
    // }

    const handleShowMap = async (empId) => {
        let locationFound = false;

        for (const key in dbUserLocations) {
            if (Object.hasOwnProperty.call(dbUserLocations, key)) {
                // Check if the key matches the empId
                if (key === empId) {
                    // Extract location details for the employee
                    const { latitude, longitude, latitudeDelta, longitudeDelta } = dbUserLocations[key];

                    console.log(`Location details for ${empId}: Latitude ${latitude}, Longitude ${longitude}`);
                    // Update state with the user's location
                    setUserLocation({ latitude, longitude, latitudeDelta, longitudeDelta });
                    locationFound = true;
                    break; // Exit loop once a match is found
                }
            }
        }

        // If location not found, set state to null
        if (!locationFound) {
            console.log('noKeyFound')
            setUserLocation(null);
        }

        // Show the map
        setShowMap(true);
    };

    console.log('userLocation', userLocation)



    useEffect(() => {
        getEmpData()
    }, [])

    return (
        <>
            <View style={{
                width: '94%', backgroundColor: 'white', marginBottom: 14, marginTop: 14, shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3,
                elevation: 5,
            }}>
                <View>
                    <Text style={{ color: "black", fontSize: 18, fontWeight: 'bold', padding: 8 }}>Location Details</Text>
                </View>

                {
                    empListLoader &&
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                }

                <View style={{ width: '100%', padding: 4, maxHeight: 450 }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} vertical={true} nestedScrollEnabled={true}>
                        <View
                            style={{
                                width: '95%',
                                backgroundColor: '#EFF3FD'
                            }}
                        >
                            {
                                empIdData && empIdData.map((item, index) => (
                                    <View key={index} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center', }}>
                                        <Text style={{ color: 'green' }}>{item.EmpId}</Text>
                                        <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, backgroundColor: '#8BC1F7', borderRadius: 4 }}
                                            onPress={() => handleShowMap(item.EmpId)}
                                        >
                                            <Text style={{ color: 'white' }}>Show Location</Text>
                                            <Image style={{ width: 30, height: 30, marginLeft: 8 }} source={location}></Image>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>

            {
                // showMap &&
                // <View style={styles.ViewImgModalWrapper}>
                //     <View style={styles.ViewImgModal}>
                //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', padding: 12 }}>
                //             <Text style={{ padding: 8, color: 'black', fontSize: 18 }}>User Location</Text>
                //             <TouchableOpacity style={{ backgroundColor: 'red', padding: 8, borderRadius: 4 }} onPress={() => setShowMap(false)}>
                //                 <Text style={{ color: 'white' }}>Close</Text>
                //             </TouchableOpacity>
                //         </View>

                //         {
                //             userLocation === null &&
                //             <View style={{ width: '100%', padding: 8, alignItems: 'center' }}>
                //                 <Text style={{ color: 'red', fontWeight: 'bold' }}>User Location not available</Text>
                //             </View>
                //         }

                //         {/* MAPAREA */}
                //         {userLocation && (
                //             <View style={styles.mapCont}>
                //                 <>
                //                     <MapView
                //                         provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                //                         style={styles.map}
                //                         initialRegion={{
                //                             latitude: userLocation.latitude,
                //                             longitude: userLocation.longitude,
                //                             latitudeDelta: 0.09,
                //                             longitudeDelta: 0.03,
                //                         }}
                //                     >
                //                         <Marker coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}>
                //                             <Image
                //                                 source={mapManS}
                //                             // style={{ width: 50, height: 100 }}
                //                             />
                //                         </Marker>
                //                     </MapView>
                //                     {/* <MapView style={styles.map} initialRegion={userLocation} provider={PROVIDER_GOOGLE}>
                //                         <Marker coordinate={userLocation} />
                //                     </MapView> */}
                //                     {/* <Text>Test</Text> */}
                //                 </>
                //             </View>
                //         )}
                //         {/* MAPAREA */}

                //         {
                //             userLocation &&
                //             <View style={{ width: '100%', padding: 8, paddingBottom: 12, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: 'auto' }}>

                //                 {/* <Text style={{ backgroundColor: 'green', color: 'white', padding: 12, borderRadius: 4 }}>{userLocation.latitude.toFixed(3)}</Text>
                //                 <Text style={{ backgroundColor: 'green', color: 'white', padding: 12, borderRadius: 4 }}>{userLocation.longitude.toFixed(3)}</Text> */}

                //                 <Text style={{ padding: 8, margin: 2, backgroundColor: 'green', color: 'white' }}>Latitude: {userLocation.latitude.toFixed(3)}</Text>
                //                 <Text style={{ padding: 8, margin: 2, backgroundColor: 'green', color: 'white' }}>Longitude: {userLocation.longitude.toFixed(3)}</Text>

                //             </View>
                //         }
                //     </View>
                // </View>
            }

        </>
    )
}

const styles = StyleSheet.create({
    ViewImgModalWrapper: {
        zIndex: 2,
        backgroundColor: '#00000080',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    ViewImgModal: {
        backgroundColor: 'white',
        position: 'fixed',
        top: '50%',
        left: '6%',
        width: '90%',
        height: '40%',
        borderRadius: 8
    },
    mapCont: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        height: 450,
        width: '100%',
    },
    map: {
        // width: '100%',
        // height: '100%'
        // width: '100%',
        // height: 450,
        ...StyleSheet.absoluteFillObject,
        // width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
    },

    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    nmap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
})

export default EmpLocation