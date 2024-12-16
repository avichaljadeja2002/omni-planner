import React, { useEffect, useState } from 'react';
// import { styles } from './styles';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { cLog } from './log';
import { IPAddr } from './constants';
import axios from 'axios';

const NotesApp = () => {

    const initialData = { userId: 1, text: "" }

    const [formData, setFormData] = useState(initialData);

    const handleSave = async () => { 
        try { 
            cLog(formData.text); 
            const hit = IPAddr + '/add_note'; 
            const response = await axios.post(hit, formData); 
            cLog('Note saved successfully:' + response.data); 
        } catch (error) { 
            console.error('Error saving note'); 
        } 
    };

    const handleChange = (name: string, value: any) => {
        setFormData({ ...formData, [name]: value });
    }

    const fetchNote = async () => {
        const hit = IPAddr + '/get_hnote/1';
        cLog('Fetching note from:' + hit);
        axios.get(hit)
            .then(response => {
                const events = response.data.map((event: any) => ({
                    text: `${event.text}`,
                    icon: 'fitness-outline',
                })).slice(0, 10);;
                setFormData({ ...formData, text: events[0]?.text || "" });
            })
            .catch(error => console.error('Error fetching events:', error));
    };

    useEffect(() => {
        fetchNote()
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notes</Text>
                <TextInput
                    onChangeText={(text) => handleChange("text", text)}
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

export default NotesApp;
