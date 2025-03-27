import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    Modal,
} from 'react-native';
import { cLog } from '../components/log';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';
import { call } from '@/components/apiCall';
import Alert from './alert';
import { useAlert } from '@/hooks/useAlert';

export default function AccountSetting() {
    const initialData = { name: '', phone: '', age: '' };
    const [formData, setFormData] = useState(initialData);
    type Prop = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<Prop>();
    const { alertModal, showAlert, hideAlert } = useAlert();
    const [changePasswordModalVisible, setChangePasswordModalVisible] =
        useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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
                showAlert(
                    'Invalid Phone',
                    'Please enter a valid phone number (7-15 digits).',
                    'Close',
                    '',
                );
                return;
            }

            await AsyncStorage.setItem('age', formData.age);
            await AsyncStorage.setItem('phone', formData.phone);
            await AsyncStorage.setItem('name', formData.name);

            const response = await call(
                `/api/users/modify_user/${token}`,
                'PUT',
                undefined,
                formData,
            );

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
            console.error('Error fetching local values from AsyncStorage:', error);
        }
    };

    const confirmLogout = async () => {
        try {
            await AsyncStorage.clear();
            navigation.navigate('index');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword.length < 8) {
            showAlert(
                'Invalid Password',
                'Password must be at least 8 characters long.',
                'Close',
                '',
            );
            return;
        }

        if (oldPassword && newPassword) {
            let diffCount = 0;
            for (let i = 0; i < Math.max(oldPassword.length, newPassword.length); i++) {
                if (oldPassword[i] !== newPassword[i]) {
                    diffCount++;
                }
            }

            if (diffCount < 8) {
                showAlert(
                    'Invalid Password',
                    'New password must have at least 8 different characters from the old password.',
                    'Close',
                    '',
                );
                return;
            }
        }

        const token = await AsyncStorage.getItem('token');
        try {
            const response = await call(`/api/users/change_password/${token}`, 'PUT', undefined, {
                oldPassword,
                newPassword,
            });

            if (response.status === 200) {
                showAlert('Success', 'Password changed successfully!', 'Close', '');
                setChangePasswordModalVisible(false);
                setOldPassword('');
                setNewPassword('');
            } else {
                showAlert(
                    'Error',
                    response.data.message || 'Failed to change password.',
                    'Close',
                    '',
                );
            }
        } catch (error) {
            console.error('Error changing password:', error);
            showAlert('Error', 'An unexpected error occurred.', 'Close', '');
        }
    };

    useFocusEffect(
        useCallback(() => {
            getLocalValues();
        }, []),
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Account Settings</Text>
            <View style={styles.accountSetting}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    value={formData.name}
                    onChangeText={(text) => handleChange('name', text)}
                    style={styles.textInput}
                    placeholder="Enter your name"
                />
            </View>
            <View style={styles.accountSetting}>
                <Text style={styles.label}>Phone (Optional)</Text>
                <TextInput
                    value={formData.phone || ''}
                    onChangeText={(text) => handleChange('phone', text)}
                    style={styles.textInput}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                />
            </View>
            <View style={styles.accountSetting}>
                <Text style={styles.label}>Age (Optional)</Text>
                <TextInput
                    value={formData.age || ''}
                    onChangeText={(text) => handleChange('age', text)}
                    style={styles.textInput}
                    placeholder="Enter your age"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() =>
                        showAlert('Logout', 'Are you sure you want to logout?', 'Cancel', 'Logout', confirmLogout)
                    }
                >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.changePasswordButton}
                    onPress={() => setChangePasswordModalVisible(true)}
                >
                    <Text style={styles.changePasswordButtonText}>Change Password</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={changePasswordModalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalHeader}>Change Password</Text>
                        <TextInput
                            style={styles.modalTextInput}
                            placeholder="Old Password"
                            secureTextEntry={true}
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />
                        <TextInput
                            style={styles.modalTextInput}
                            placeholder="New Password"
                            secureTextEntry={true}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.buttonCancel}
                                onPress={() => setChangePasswordModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonConfirm} onPress={handlePasswordChange}>
                                <Text style={styles.textStyle}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Alert
                isVisible={alertModal.visible}
                toggleModal={hideAlert}
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        alignSelf: 'center',
    },
    accountSetting: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#333',
        width: '30%',
    },
    textInput: {
        flex: 1,
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    footer: {
        alignItems: 'center',
        marginTop: 30,
    },
    saveButton: {
        backgroundColor: '#65558f',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 40,
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#ff6347',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 40,
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    changePasswordButton: {
        backgroundColor: '#4a6572',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 40,
        alignItems: 'center',
        width: '100%',
    },
    changePasswordButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
    },
    modalHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    modalTextInput: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        width: '100%',
        backgroundColor: '#fff',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    buttonCancel: {
        backgroundColor: '#6c757d',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flex: 0.48,
        alignItems: 'center',
    },
    buttonConfirm: {
        backgroundColor: '#28a745',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flex: 0.48,
        alignItems: 'center',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});