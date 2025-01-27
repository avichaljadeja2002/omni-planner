import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { cLog } from '../components/log';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';

export default function AccountSetting() {
    const initialData = { userId: 1, name: "", userName: "", email: "" };
    const [formData, setFormData] = useState(initialData);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    type Prop = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<Prop>();

    const handleSave = async () => {
        try {
            cLog(formData);
            await AsyncStorage.setItem('name', formData.name);
            await AsyncStorage.setItem('userName', formData.userName);
            await AsyncStorage.setItem('email', formData.email);
            // const response = await call('/modify_user', 'PUT', formData); // Send request with updated data
            // cLog('Note saved successfully: ' + response.data);
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    // Fetch local data from AsyncStorage
    const getLocalValues = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const name = await AsyncStorage.getItem('name');
            const userName = await AsyncStorage.getItem('userName');
            const email = await AsyncStorage.getItem('email');

            // Update state with retrieved values
            setFormData({
                userId: userId ? parseInt(userId, 10) : 1,  // Default to 1 if not found
                name: name || '',
                userName: userName || '',
                email: email || '',
            });
        } catch (error) {
            console.error("Error fetching local values from AsyncStorage:", error);
        }
    };

    const handleLogout = async () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        try {
            await AsyncStorage.clear();
            navigation.navigate("index");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getLocalValues();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Name</Text>
                <TextInput
                    value={formData.name} // Set value to formData.text to make it controlled
                    onChangeText={(text) => handleChange("name", text)} // Handle text changes
                    style={styles.textInput}
                    placeholder="name"
                    multiline={true}
                />
                <Text style={styles.title}>Username</Text>
                <TextInput
                    value={formData.userName} // Set value to formData.text to make it controlled
                    onChangeText={(text) => handleChange("userName", text)} // Handle text changes
                    style={styles.textInput}
                    placeholder="username"
                    multiline={true}
                />
                <Text style={styles.title}>Email</Text>
                <TextInput
                    value={formData.email} // Set value to formData.text to make it controlled
                    onChangeText={(text) => handleChange("email", text)} // Handle text changes
                    style={styles.textInput}
                    placeholder="email"
                    multiline={true}
                />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showLogoutModal}
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure you want to logout?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonConfirm]}
                                onPress={confirmLogout}
                            >
                                <Text style={styles.textStyle}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'left',
    },
    textInput: {
        height: 50,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#65558f',
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 50,
        justifyContent: 'center',
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#eee',
    },
    logoutButton: {
        backgroundColor: '#ff6347',
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 50,
        marginTop: 10,
    },
    logoutButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        minWidth: 100,
    },
    buttonCancel: {
        backgroundColor: "#2196F3",
    },
    buttonConfirm: {
        backgroundColor: "#f44336",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
});
