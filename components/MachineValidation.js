import { View, Text, ScrollView, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';



const MachineValidation = () => {

    const navigation = useNavigation()

    const [loginError, setLoginError] = useState('')

    const [cmpCode, setCmpCode] = useState('')

    const [cmpCodeView, setCmpCodeView] = useState(true)

    const [pubKey, setPubKey] = useState('')

    const [regView, setRegView] = useState(false)

    const [privateKey, setPrivateKey] = useState('')

    const handleGetPubKey = () => {
        // e.preventDefault();
        // setDisplayDeviceValid(false)

        if (cmpCode) {
            // setLoginClick(true);
            // setUserData({
            //     username: "",
            // });

            const url = `https://cubixweberp.com:164/GetPublicKey?cmpcode=${cmpCode}`;

            console.log(url);
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log('Raw Response:', data);
                    if (data.length > 0) {
                        setPubKey(data[0].systemkey)
                        setCmpCodeView(false)
                        setRegView(true)
                        // setLoginClick(false);
                    } else {
                        setPubKey('invalid company code')
                        setLoginError('Invalid Company Code. Please try again.');
                        setCmpCode('')
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    setLoginError('Invalid Company Code. Please try again.');
                    setCmpCode('')
                    // setLoginClick(false);
                });
        }
    };

    const handleRegistration = async () => {
        // e.preventDefault();
        // setDisplayDeviceValid(false);

        if (cmpCode && privateKey && pubKey) {
            // setLoginClick(true);

            try {
                const storedUserDataArrayJson = await AsyncStorage.getItem("userDataArray");
                const storedUserDataArray = storedUserDataArrayJson ? JSON.parse(storedUserDataArrayJson) : [];

                const url = `https://cubixweberp.com:164/CheckStatus?cmpcode=${cmpCode}&publick=${pubKey}&privatek=${privateKey}`;

                console.log(url);
                const response = await fetch(url);
                const data = await response.json();
                console.log('Raw Response:', data);

                if (data[0].Column1 === 'REGISTERED') {
                    const newCompanyData = {
                        cmpcode: cmpCode,
                        publick: pubKey,
                        privatek: privateKey
                    };
                    storedUserDataArray.push(newCompanyData);

                    await AsyncStorage.setItem("userDataArray", JSON.stringify(storedUserDataArray));
                    // await AsyncStorage.setItem("selectedCompany", JSON.stringify(newCompanyData));

                    navigation.navigate('LoginPage');
                } else {
                    setLoginError("Invalid Private Key");
                    setPrivateKey('')
                    // navigation.navigate('LoginPage');

                    // setLoginClick(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setLoginError('Error during login. Please try again.');
                // setLoginClick(false);
            }
        }
    }

    useEffect(() => {
        const checkUserData = async () => {
            try {
                const storedUserDataArrayJson = await AsyncStorage.getItem("userDataArray");
                if (storedUserDataArrayJson) {
                    const storedUserDataArray = JSON.parse(storedUserDataArrayJson);
                    if (storedUserDataArray.length > 0) {
                        // Redirect to LoginPage if userDataArray exists and has values
                        navigate('/login');
                    }
                }
            } catch (error) {
                console.error('Error checking user data:', error);
            }
        };

        checkUserData(); // Call the function when the component mounts
    }, []);


    return (
        <SafeAreaView>

            <ScrollView>

                <View style={{
                    padding: 8,
                    alignItems: 'center'
                }}>
                    <Text style={{
                        color: 'black',
                        fontSize: 20,
                        fontWeight: 'bold'

                    }}>Machine Validation</Text>
                </View>

                <View style={{
                    backgroundColor: '#F0F8FF',
                    padding: 28
                }}>

                    {
                        loginError !== '' &&
                        <View>
                            <Text style={{ color: 'red', fontWeight: 'bold' }}>{loginError}</Text>
                        </View>

                    }

                    {
                        cmpCodeView &&
                        <>
                            <Text>Enter Company Code</Text>
                            <TextInput style={{ borderBottomColor: 'grey', borderBottomWidth: 1, backgroundColor: 'white', marginBottom: 12, marginTop: 12 }} value={cmpCode} onChangeText={(text) => setCmpCode(text)}></TextInput>
                            {/* <Text>Enter Private Key</Text>
                        <TextInput style={{ borderBottomColor: 'grey', borderBottomWidth: 1, backgroundColor: 'white', marginBottom: 12, marginTop: 12 }}></TextInput> */}

                            <View style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>
                                {
                                    cmpCode !== '' &&
                                    <TouchableOpacity style={{ padding: 12, backgroundColor: 'black', borderRadius: 4 }} onPress={handleGetPubKey}>
                                        <Text style={{ color: 'white' }}>Get Public Key</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </>
                    }

                    {
                        regView &&
                        <>
                            <Text>Enter Private Key</Text>
                            <TextInput style={{ borderBottomColor: 'grey', borderBottomWidth: 1, backgroundColor: 'white', marginBottom: 12, marginTop: 12 }} value={privateKey} onChangeText={(text) => setPrivateKey(text)}></TextInput>
                            {/* <Text>Enter Private Key</Text>
                        <TextInput style={{ borderBottomColor: 'grey', borderBottomWidth: 1, backgroundColor: 'white', marginBottom: 12, marginTop: 12 }}></TextInput> */}

                            <View style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>
                                {
                                    cmpCode !== '' &&
                                    <TouchableOpacity style={{ padding: 12, backgroundColor: 'black', borderRadius: 4 }} onPress={handleRegistration}>
                                        <Text style={{ color: 'white' }}>Register</Text>
                                    </TouchableOpacity>
                                }
                            </View>

                            <View style={{
                                width: '100%'
                            }}>
                                <Text style={{ padding: 12, color: 'darkgreen', fontSize: 20 }}>Your Public Key is: {pubKey}</Text>
                                <Text style={{ padding: 12, color: 'darkgreen', fontSize: 20 }}>Your Company Code  is: {cmpCode}</Text>
                                <Text style={{ padding: 12, color: 'orange', fontSize: 20 }}>You will receive Private Key from the company</Text>
                            </View>

                            <View style={{ width: '100%' }}>
                                <Text style={{ fontSize: 16 }}>Cubix Dashboard, Developed by Cubix IT Solutions LLC</Text>
                            </View>
                        </>
                    }


                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MachineValidation