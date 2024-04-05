import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import ToastManager, { Toast } from 'toastify-react-native'
import axios from 'axios'


const NewProject = ({ onClose }) => {

    const [description, setDescription] = useState('')
    const [jobCode, setJobCode] = useState('')

    const [dupCheck, setDupcheck] = useState('')

    const successToast = () => {
        Toast.success('Project Created Successfully')
    }

    // console.log(description, jobCode)

    const DupCheck = async () => {
        try {
            const response = await axios.get(`https://cubixweberp.com:156/api/DupCheck/CPAYS/JOBCODE/${jobCode}`)
            if (response.data[0].COUNT === 0) {
                setDupcheck(0)
                console.log(response.data)
            } else {
                setDupcheck(1)
                console.log(response.data)
            }
        } catch (error) {
            console.log('DupCheck', error)
        }
    }

    const handleProjectCreate = async () => {
        await DupCheck()

        if (dupCheck === 0) {

            let reqData = {
                mode: "ENTRY",
                cmpcode: "CPAYS",
                jobcode: jobCode,
                site_description: description,
                job_status: "NEW",
                transid: "DE9ECBC2-F1DF-40F1-BC67-4BD3087978BD"
            }

            let stringifiedJson = JSON.stringify(reqData)

            console.log(stringifiedJson)

            try {
                const response = await axios.post(`https://cubixweberp.com:156/api/CRMProjectReg/ENTRY/CPAYS/${jobCode}/${description}/NEW/DE9ECBC2-F1DF-40F1-BC67-4BD3087978BD`, stringifiedJson, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.status === 200) {
                    console.log(response.data)
                    setDescription('')
                    setJobCode('')
                    setDupcheck('')
                    successToast()
                }
            } catch (error) {
                console.log('ProjectCreateErr', error)
            }
        }
    }

    return (
        <View style={styles.NewProjectWrapper}>
            <View style={styles.NewProjectCont}>

                <ToastManager width={350} height={100} textStyle={{ fontSize: 17 }} />

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 12
                }}>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>New Project</Text>
                    <TouchableOpacity style={{
                        padding: 8, borderRadius: 4, backgroundColor: '#FFC107'
                    }} onPress={onClose}>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>Close</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%' }}>
                    <TextInput
                        style={{ borderBottomColor: 'grey', borderBottomWidth: 1, backgroundColor: 'white', marginBottom: 12 }}
                        placeholder='Description'
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                    />
                    <TextInput
                        style={{ borderBottomColor: 'grey', borderBottomWidth: 1, backgroundColor: 'white', marginBottom: 12 }}
                        placeholder='Job Code'
                        value={jobCode}
                        onChangeText={(text) => setJobCode(text)}
                    />

                    {
                        dupCheck === 1 &&
                        <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 8 }}>Job code already exists, try with a different job code</Text>
                    }

                </View>

                {
                    description !== '' && jobCode !== '' &&

                    <View style={{
                        justifyContent: 'center', alignItems: "center"
                    }}>
                        <TouchableOpacity style={{ padding: 12, borderRadius: 4, backgroundColor: '#198754', color: "white" }} onPress={handleProjectCreate}>
                            <Text style={{ color: 'white' }}>Create Project</Text>
                        </TouchableOpacity>
                    </View>
                }

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    NewProjectWrapper: {
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
    NewProjectCont: {
        backgroundColor: '#F7F7F7',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '94%',
        height: 280
    },
})

export default NewProject