import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Props } from '../_layout';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const data = [
    { label: 'Daily', value: '1' },
    { label: 'Weekly', value: '2' },
    { label: 'Monthly', value: '3' },
    { label: 'Yearly', value: '4' },
];

export default function AddCalendarEvents({ navigation }: Props) {
    const [value, setValue] = useState<string | null>(null);
    const [isFocus, setIsFocus] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [timePickerVisible, setTimePickerVisible] = useState(false);

    const [eventData, setEventData] = useState({
        user_id: 1,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
        repeating: false,
        repeat_timeline: '',
        description: ''
    });

    const handleChange = (name: string, value: any) => {
        setEventData({ ...eventData, [name]: value });
    };

    const handleSave = async () => {
        const formattedData = {
            ...eventData,
            event_date: eventData.event_date.toISOString().split('T')[0], // Ensures YYYY-MM-DD format
            event_time: eventData.event_time.toTimeString().split(' ')[0], // HH:MM:SS format
        };
            
        try {
            const response = await axios.post('http://192.168.1.11:8080/add_calendar_events', formattedData);
            console.log('Event saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const showTimePicker = () => {
        setTimePickerVisible(true);
    };

    const handleDateChange = (event: any, selectedDate: any) => {
        setDatePickerVisible(Platform.OS === 'ios');
        if (selectedDate) {
            handleChange('event_date', selectedDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime: any) => {
        setTimePickerVisible(Platform.OS === 'ios');
        if (selectedTime) {
            handleChange('event_time', selectedTime);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ height: 100 }}></View>
            <View>
                <View style={styles.inLine}>
                    <Text style={styles.sectionHeader}>Add new Calendar Event</Text>
                    <TouchableOpacity style={{ marginLeft: 50 }}
                        onPress={() => console.log("pressed")}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                        <View style={styles.taskicon}>
                            <Ionicons name="walk-outline" size={30} color={'#000'} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.inLine}>
                        <Text style={styles.inputText}>Title</Text>
                        <TextInput
                            style={styles.input}
                            value={eventData.title}
                            onChangeText={(text) => handleChange('title', text)}
                        />
                    </View>

                    <View style={styles.inLine}>
                        <Text style={styles.inputText}>Date</Text>
                        <TouchableOpacity onPress={showDatePicker} style={styles.input}>
                            <Text>{eventData.event_date.toDateString()}</Text>
                        </TouchableOpacity>
                        {datePickerVisible && (
                            <DateTimePicker
                                value={eventData.event_date}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                    </View>

                    <View style={styles.inLine}>
                        <Text style={styles.inputText}>Time</Text>
                        <TouchableOpacity onPress={showTimePicker} style={styles.input}>
                            <Text>{eventData.event_time.toTimeString().split(' ')[0]}</Text>
                        </TouchableOpacity>
                        {timePickerVisible && (
                            <DateTimePicker
                                value={eventData.event_time}
                                mode="time"
                                display="default"
                                onChange={handleTimeChange}
                            />
                        )}
                    </View>

                    <View style={styles.inLine}>
                        <Text style={styles.inputText}>Repeating</Text>
                        <View style={styles.container}>
                            <Dropdown
                                style={{ width: 200, borderWidth: 1, padding: 8 }}
                                data={data}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                value={value}
                                onChange={item => {
                                    setValue(item.value);
                                    setIsFocus(false);
                                    handleChange('repeat_timeline', item.label);
                                }}
                                renderLeftIcon={() => (
                                    <Ionicons
                                        name='calendar-outline'
                                        size={20}
                                        paddingRight={10}
                                    />
                                )}
                            />
                        </View>
                    </View>

                    <View style={styles.inLine}>
                        <Text style={styles.inputText}>Description</Text>
                        <TextInput
                            style={styles.input}
                            value={eventData.description}
                            onChangeText={(text) => handleChange('description', text)}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.saveCancelContainer}>
                <View style={styles.saveCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('calendarEvents')}
                        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
                        <Ionicons name='close-circle-outline' size={30} color={'#000'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.saveCancel}>
                    <Text style={styles.saveText}>Save</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
                        <Ionicons name="save-outline" size={30} color={'#000'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
