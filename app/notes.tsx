import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { cLog } from './log';
import { IPAddr } from './constants';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Notes () {
    const initialData = { userId: 1, text: "" };

    const [formData, setFormData] = useState(initialData);

    const handleSave = async () => {
        try {
            // Add current date to formData
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in ISO format (e.g., 2024-06-14T10:00:00.000Z)
            const currentTime = new Date().toTimeString().split(' ')[0];
            const updatedFormData = {
                ...formData,
                event_date: currentDate, // Add date field
                event_time: currentTime, // Add time field
            };
            const hit = IPAddr + '/add_note'; // Backend endpoint
            const response = await axios.put(hit, updatedFormData); // Send request with updated data

            console.log('Note saved successfully: ' + response.data);
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const fetchNote = async () => {
        const hit = IPAddr + '/get_note/'+(await AsyncStorage.getItem('userId'));
        cLog('Fetching note from:' + hit);
        axios.get(hit)
            .then(response => {
                const events = response.data.map((event: { text: any; }) => ({
                    text: `${event.text}`,
                }));
                setFormData({ ...formData, text: events[0]?.text || "" });
            })
            .catch(error => console.error('Error fetching events:', error));
    };

    useFocusEffect(
        useCallback(() => {
            fetchNote();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notes</Text>
                <TextInput
                    value={formData.text} // Set value to formData.text to make it controlled
                    onChangeText={(text) => handleChange("text", text)} // Handle text changes
                    style={styles.textInput}
                    placeholder="Write your notes here..."
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
        textAlign: 'center',
    },
    textInput: {
        height: 450,
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
