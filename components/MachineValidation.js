import { View, Text, ScrollView, TextInput, Button, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import footerBg from '../images/footer_bg.png'
import cloud from '../images/cloud_svg.png'
import cbxLogo from '../images/cbxLogo.png'


const MachineValidation = () => {

    const navigation = useNavigation()

    const [loginError, setLoginError] = useState('')

    const [cmpCode, setCmpCode] = useState('')

    const [cmpCodeView, setCmpCodeView] = useState(true)

    const [pubKey, setPubKey] = useState('')

    const [regView, setRegView] = useState(false)

    const [privateKey, setPrivateKey] = useState('')

    const [showLoader, setShowLoader] = useState(false)

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
                    // setPrivateKey('')
                    // setRegView(false)
                    // setCmpCodeView(true)
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

    const validateCompany = async (company) => {
        console.log('validateCmp')
        if (company.cmpcode && company.publick && company.privatek) {
            const result = await fetch(`https://cubixweberp.com:164/CheckStatus?cmpcode=${company.cmpcode}&publick=${company.publick}&privatek=${company.privatek}`)
            const data = await result.json()
            // console.log(data)
            // setDeviceValidation(data[0].Column1)
            if (data[0].Column1 === 'VALIDATED') {
                // localStorage.setItem("selectedCompany", JSON.stringify(company));
                navigation.navigate('LoginPage');
            }
        } else {
            setLoginError('not validated')
            // navigate('/');
            console.log("not validated")
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setShowLoader(true)
            const checkUserData = async () => {
                try {
                    const storedUserDataArrayJson = await AsyncStorage.getItem("userDataArray");
                    if (storedUserDataArrayJson) {
                        const storedUserDataArray = JSON.parse(storedUserDataArrayJson);
                        if (storedUserDataArray.length > 0) {
                            const company = storedUserDataArray[0]
                            validateCompany(company)
                            // Redirect to LoginPage if userDataArray exists and has values
                            navigation.navigate('LoginPage');
                            setShowLoader(false)
                        }
                    } else {
                        setShowLoader(false)

                        navigation.navigate('LoginPage');

                        setLoginError('Machine not Validated')
                        // navigate('/');
                        console.log("Machine not Validated")
                    }
                } catch (error) {
                    console.error('Error checking user data:', error);
                    setShowLoader(false)
                }
            };

            checkUserData(); // Call the function when the screen comes into focus
            return () => {
                // Clean-up function (optional)
            };
        }, [])
    );

    console.log('r', showLoader)

    return (
        <SafeAreaView style={styles.container}>

            <LinearGradient
                colors={['#98b2e5', 'rgba(10, 184, 149, 0.057)']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.container}
            >

                <ScrollView>

                    <View style={styles.LoginWrapper}>

                        {/* <ToastManager width={350} height={100} textStyle={{ fontSize: 17 }} /> */}

                        {/* cloudImg */}
                        <View>
                            <Image source={cloud}></Image>
                        </View>

                        <View style={{
                            justifyContent: 'flex-start',
                            width: "100%"
                        }}>
                            <View
                                style={{
                                    width: "44%",
                                    backgroundColor: "white",
                                    marginLeft: 28,
                                    padding: 8,
                                    borderRadius: 4,
                                }}
                            >
                                <Image source={cbxLogo} style={styles.cbxLogo}></Image>
                            </View>
                        </View>

                        {/* Validation form */}
                        <View style={{
                            padding: 8,
                            alignItems: 'center',
                            width: '100%',
                            marginTop: 18
                        }}>
                            <Text style={{
                                color: 'black',
                                fontSize: 20,
                                fontWeight: 'bold'

                            }}>Machine Validation</Text>
                        </View>

                        <View style={{
                            backgroundColor: '#F0F8FF',
                            padding: 28,
                            width: '100%',
                            marginTop: 18
                        }}>

                            {
                                showLoader &&
                                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 12 }}>
                                    <ActivityIndicator size={'large'} />
                                    <Text style={{ color: '#FF5733', fontSize: 16 }}>Validating Machine, please wait ...</Text>
                                </View>
                            }

                            {
                                loginError !== '' &&
                                <View style={{ marginVertical: 12 }}>
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
                                        width: '100%',
                                        backgroundColor: 'white',
                                        marginTop: 12
                                    }}>
                                        <Text style={{ padding: 12, color: 'darkgreen', fontSize: 20 }}>Your Public Key is: {pubKey}</Text>
                                        <Text style={{ padding: 12, color: 'darkgreen', fontSize: 20 }}>Your Company Code  is: {cmpCode}</Text>
                                        <Text style={{ padding: 12, color: 'orange', fontSize: 20 }}>You will receive Private Key from the company</Text>
                                    </View>

                                    <View style={{ width: '100%', marginTop: 12 }}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Admin Dashboard, Developed by Cubix IT Solutions LLC</Text>
                                    </View>
                                </>
                            }


                        </View>


                        {/* bottomImg */}
                        <View style={{
                            marginTop: '10%'
                        }}>
                            <Image style={{
                                width: 380, height: 200
                            }} source={footerBg}></Image>
                        </View>
                    </View>

                </ScrollView>
            </LinearGradient>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    LoginWrapper: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        height: '100%'
        // backgroundColor: "#F1F1FB",
    },
    Logincontainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '85%',
        backgroundColor: "#F7F7F7",
        paddingVertical: 32,
        borderRadius: 8
    },
    inputContainer: {
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: 'white',
        paddingLeft: 10,
    },
    // input: {
    //     width: '80%',
    //     height: 40,
    //     border: "none",
    //     borderWidth: 1,
    //     borderRadius: 5,
    //     marginBottom: 20,
    //     paddingLeft: 10,
    // },
    button: {
        width: '80%',
        backgroundColor: '#0D6EFD',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    label: {
        marginBottom: 5,
        alignSelf: 'flex-start',
        marginLeft: '10%',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerImg: {
        width: 100,
        height: 250
    },
    cbxLogo: {
        width: 150,
        height: 25
    }
})

export default MachineValidation