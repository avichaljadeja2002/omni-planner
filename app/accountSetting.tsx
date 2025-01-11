import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import { IPAddr } from './constants';
// import axios from 'axios';
import { cLog } from './log';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';
// import GenericViewPageForm from './viewEventPage';

export default function AccountSetting () {
    const initialData = { userId: 1, name: "", userName: "", email: "" };

    const [formData, setFormData] = useState(initialData);

    const handleSave = async () => {
        try {
            cLog(formData);
            await AsyncStorage.setItem('name', formData.name);
            await AsyncStorage.setItem('userName', formData.userName);
            await AsyncStorage.setItem('email', formData.email);
            // const hit = IPAddr + '/modify_user'; // Backend endpoint
            // const response = await axios.put(hit, formData); // Send request with updated data
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
            </View>
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
        alignItems: 'flex-end',
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
});
