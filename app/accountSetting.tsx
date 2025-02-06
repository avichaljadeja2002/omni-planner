import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { cLog } from '../components/log';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';
import { call } from '@/components/apiCall';
import Alert from './alert';
import { useAlert } from '@/hooks/useAlert';

export default function AccountSetting() {
    const initialData = { name: "", phone: "", age: "" };
    const [formData, setFormData] = useState(initialData);
    type Prop = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<Prop>();
    const { alertModal, showAlert, hideAlert } = useAlert();

    const handleSave = async () => {
        const token = await AsyncStorage.getItem('token');

        try {
            if (!formData.name.trim()) {
                showAlert('Invalid!', 'Name cannot be empty.', 'Close', '');
                return;
            }

            if (formData.age) {
                const age = Number(formData.age);
                if (isNaN(age) || age < 1 || age > 150) {
                    cLog(1, 'Invalid Age:', formData.age);
                    showAlert('Invalid Age', 'Please enter a valid age (1-150).', 'Close', '');
                    return;
                }
            }

            const phoneRegex = /^[0-9]{7,15}$/;
            if (formData.phone && !phoneRegex.test(formData.phone)) {
                cLog(1, 'Invalid Phone:', formData.phone);
                showAlert('Invalid Phone', 'Please enter a valid phone number (7-15 digits).', 'Close', '');
                return;
            }

            await AsyncStorage.setItem('age', formData.age);
            await AsyncStorage.setItem('phone', formData.phone);
            await AsyncStorage.setItem('name', formData.name);

            const response = await call(`/api/users/modify_user/${token}`, 'PUT', undefined, formData);

            if (response.status === 401) {
                throw new Error(response.data.message);
            } else {
                Keyboard.dismiss();
                showAlert('Success', 'Data saved successfully!', 'Close', '');
                cLog(1, 'Account Information saved successfully:', formData);
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

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
                <View style={styles.accountSetting}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        value={formData.name}
                        onChangeText={(text) => handleChange("name", text)}
                        style={styles.textInput}
                        placeholder="Enter your name"
                    />
                </View>
                <View style={styles.accountSetting}>
                    <Text style={styles.label}>Phone (Optional)</Text>
                    <TextInput
                        value={formData.phone || ''}
                        onChangeText={(text) => handleChange("phone", text)}
                        style={styles.textInput}
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                    />
                </View>
                <View style={styles.accountSetting}>
                    <Text style={styles.label}>Age (Optional)</Text>
                    <TextInput
                        value={formData.age || ''}
                        onChangeText={(text) => handleChange("age", text)}
                        style={styles.textInput}
                        placeholder="Enter your age"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={() => showAlert('Logout', 'Are you sure you want to logout?', 'Cancel', 'Logout', confirmLogout)}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <Alert
                isVisible={alertModal.visible}
                toggleModal={hideAlert}  // Updated to use hideAlert
                header={alertModal.header}
                description={alertModal.message}
                onSave={() => {
                    alertModal.onSave();
                    hideAlert();
                }}
                saveButtonText={alertModal.saveText}
                closeButtonText={alertModal.closeText}
            />
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
        flexDirection: 'column',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    accountSetting: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'column',
        gap: 20,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left',

    },
    textInput: {
        height: 45,
        borderColor: '#ccc',
        width: '70%',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
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
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },

});
