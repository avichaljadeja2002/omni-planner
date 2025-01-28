import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { cLog } from '../components/log';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';
import { call } from '@/components/apiCall';

export default function AccountSetting() {
    const initialData = { name: "", phone: "", age: "" };
    const [formData, setFormData] = useState(initialData);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    type Prop = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<Prop>();

    const handleSave = async () => {
        const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
        try {
            await AsyncStorage.setItem('name', formData.name);
            await AsyncStorage.setItem('phone', formData.phone);
            await AsyncStorage.setItem('age', formData.age);
            const response = await call(`/api/users/modify_user/${token}`, 'PUT', undefined, formData); // Send request with updated data
            if (response.status == 401) {
                throw new Error(response.data.message);
            }
            cLog('Data saved successfully:', formData);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };


    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    // Fetch local data from AsyncStorage
    const getLocalValues = async () => {
        try {
            const name = await AsyncStorage.getItem('name');
            const phone = await AsyncStorage.getItem('phone');
            const age = await AsyncStorage.getItem('age');

            setFormData({
                name: name || '',
                phone: phone || '',
                age: age || '',
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
                <Text style={styles.label}>Name</Text>
                <TextInput
                    value={formData.name}
                    onChangeText={(text) => handleChange("name", text)}
                    style={styles.textInput}
                    placeholder="Enter your name"
                />
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    value={formData.phone || ''}
                    onChangeText={(text) => handleChange("phone", text)}
                    style={styles.textInput}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                />
                <Text style={styles.label}>Age (Optional)</Text>
                <TextInput
                    value={formData.age || ''}
                    onChangeText={(text) => handleChange("age", text)}
                    style={styles.textInput}
                    placeholder="Enter your age"
                    keyboardType="numeric"
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'left',
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
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    header: {
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        textAlign: 'left',
    },
    textInput: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#65558f',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#ff6347',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 40,
        marginTop: 10,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
