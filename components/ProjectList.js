import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ToastManager, { Toast } from 'toastify-react-native'
import checked from '../images/ic_check_scanned_button.png'


const ProjectList = ({ onClose }) => {

    const [projectListData, setProjectListData] = useState(null)

    const [editView, setEditView] = useState(false)

    const [editViews, setEditViews] = useState([]);

    const [editedDescriptions, setEditedDescriptions] = useState([]);

    const [projectStatus, setProjectStatus] = useState([]);

    const fetchProjectListData = async () => {
        try {
            const response = await axios.get('https://cubixweberp.com:156/api/CRMProjectList/CPAYS/full');

            if (response.status === 200) {
                const initialEditViews = Array(response.data.length).fill(false);
                const initialEditedDescriptions = Array(response.data.length).fill(null);
                const initialProjectStatus = Array(response.data.length).fill("OPEN");
                setProjectListData(response.data);
                setEditViews(initialEditViews);
                setEditedDescriptions(initialEditedDescriptions);
                setProjectStatus(initialProjectStatus);
            }
        } catch (error) {
            console.log('fetchProjectListData error', error);
        }
    };

    useEffect(() => {

        fetchProjectListData();
    }, []);

    const toggleEditView = (index) => {
        const newEditViews = [...editViews];
        newEditViews[index] = !newEditViews[index];

        if (!newEditViews[index]) {
            const newEditedDescriptions = [...editedDescriptions];
            newEditedDescriptions[index] = null;
            setEditedDescriptions(newEditedDescriptions);

            // Reset the project status back to "OPEN"
            const newProjectStatus = [...projectStatus];
            newProjectStatus[index] = "OPEN";
            setProjectStatus(newProjectStatus);
        }

        setEditViews(newEditViews);
    };


    const handleDescriptionChange = (value, index) => {
        const newEditedDescriptions = [...editedDescriptions];
        newEditedDescriptions[index] = value;
        setEditedDescriptions(newEditedDescriptions);
    };

    const handleCancel = (index) => {
        toggleEditView(index);
        // Reset the edited description back to the original description
        const newEditedDescriptions = [...editedDescriptions];
        newEditedDescriptions[index] = null;
        setEditedDescriptions(newEditedDescriptions);

        // Reset the project status back to "OPEN"
        const newProjectStatus = [...projectStatus];
        newProjectStatus[index] = "OPEN";
        setProjectStatus(newProjectStatus);
    };


    const handleSave = async (index) => {
        console.log(index)
        // Accessing jobcode, description, job_status, transid of the current editing item
        const { Job_code, tranid } = projectListData[index];
        const description = editedDescriptions[index];
        const status = projectStatus[index];

        let taskObjectForAPI = {
            mode: "EDIT",
            cmpcode: "CPAYS",
            jobcode: Job_code,
            site_description: description,
            job_status: status,
            transid: tranid
        };

        let stringifiedJson = JSON.stringify(taskObjectForAPI)

        try {
            const response = await axios.post(`https://cubixweberp.com:156/api/CRMProjectReg/EDIT/CPAYS/${Job_code}/${description}/${status}/${tranid}`, stringifiedJson, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                // console.log('editSuccess', response.data)
                showEditSuccessToast()
                fetchProjectListData()
            }


        } catch (error) {
            console.log('editErr', error)
        }

        // Send taskObjectForAPI to the API
        console.log(taskObjectForAPI);
    };

    const handleCloseProject = (index) => {
        const newProjectStatus = [...projectStatus];
        newProjectStatus[index] = newProjectStatus[index] === "OPEN" ? "CLOSED" : "OPEN";
        setProjectStatus(newProjectStatus);
    };


    const showEditSuccessToast = () => {
        Toast.success('Description updated Successfully')
    }

    console.log(editViews)
    console.log(editedDescriptions)


    return (
        <View style={styles.ProjectListWrapper}>
            <View style={styles.ProjectListCont}>

                <ToastManager width={350} height={100} textStyle={{ fontSize: 17 }} />

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 8
                }}>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>Project</Text>
                    <TouchableOpacity style={{
                        padding: 8, borderRadius: 4, backgroundColor: '#FFC107'
                    }} onPress={onClose}>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>Close</Text>
                    </TouchableOpacity>
                </View>

                {
                    projectListData === null &&
                    <ActivityIndicator color='blue' size='large'></ActivityIndicator>
                }

                <ScrollView vertical={true} style={{ padding: 6, width: '100%' }}>

                    {
                        projectListData && projectListData.map((project, index) => (
                            <View style={{ marginBottom: 8, padding: 6, width: '100%', borderColor: 'grey', borderWidth: 1, borderRadius: 4 }} key={index}>

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <TouchableOpacity style={{ padding: 4, backgroundColor: '#212529', width: '20%', alignItems: 'center', borderRadius: 4, marginBottom: 6 }} onPress={() => toggleEditView(index)}>
                                        <Text style={{ color: 'white' }}>Edit</Text>
                                    </TouchableOpacity>

                                    {
                                        editViews[index] &&
                                        <TouchableOpacity style={{ marginLeft: 12, flexDirection: 'row', alignItems: 'center', padding: 4, backgroundColor: projectStatus[index] === "CLOSED" ? '#198754' : 'white', borderRadius: 4 }} onPress={() => handleCloseProject(index)}>
                                            <Image style={{ width: 25, height: 25 }} source={checked}></Image>
                                            <Text style={{ color: projectStatus[index] === "CLOSED" ? 'white' : 'black' }}>Close Project</Text>
                                        </TouchableOpacity>
                                    }


                                </View>

                                {
                                    !editViews[index] &&
                                    <>
                                        <View style={{
                                            flexDirection: 'row', justifyContent: 'space-between', padding: 2, marginBottom: 6
                                        }}>
                                            <Text style={{
                                                padding: 8, backgroundColor: '#D3D3D3', color: 'black'
                                            }}>{project.Job_code}</Text>
                                            <Text style={{
                                                padding: 8, backgroundColor: '#D3D3D3', color: 'black'
                                            }}>{project.status}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: 'black', fontSize: 17, padding: 4 }}>{project.Description}</Text>
                                        </View>
                                    </>
                                }


                                {
                                    editViews[index] &&
                                    <View>
                                        <TextInput
                                            style={{ borderBottomColor: 'grey', borderBottomWidth: 1 }}
                                            value={editedDescriptions[index] !== null ? editedDescriptions[index] : project.Description}
                                            onChangeText={(value) => handleDescriptionChange(value, index)}
                                        />

                                        <View style={{ width: '100%', flexDirection: "row", justifyContent: 'center' }}>
                                            <TouchableOpacity style={{ padding: 12, margin: 8, backgroundColor: '#D3D3D3', borderRadius: 4 }} onPress={() => handleCancel(index)}>
                                                <Text style={{ color: 'black' }}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ padding: 12, margin: 8, backgroundColor: '#0D6EFD', borderRadius: 4 }} onPress={() => handleSave(index)}>
                                                <Text style={{ color: 'white' }}>Save</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }

                            </View>

                        ))
                    }
                </ScrollView>


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ProjectListWrapper: {
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
    ProjectListCont: {
        backgroundColor: '#F7F7F7',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '94%',
        height: '80%'
    },
    TableContainer: {
        width: "100%",
        padding: 10,
        marginTop: 2
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: 5,
        // paddingVertical: 5,
    },
    headerCell: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        flexWrap: 'nowrap',
        width: 120
    },
    dataCell: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        padding: 10,
        textAlign: 'center',
        width: 120,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderColor: 'white',
        color: "black"
    },
})

export default ProjectList