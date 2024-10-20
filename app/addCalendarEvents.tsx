import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Button } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IPAddr } from './constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';

// Import Google Calendar Service
import { useGoogleCalendar } from './googleCalendarLink'; 

const data = [
    { label: 'Daily', value: '1' },
    { label: 'Weekly', value: '2' },
    { label: 'Monthly', value: '3' },
    { label: 'Yearly', value: '4' },
];

export default function AddCalendarEvents() {
    type AddCalendarTrackerNavigationProp = StackNavigationProp<RootStackParamList, 'addCalendarEvents'>;
    const navigation = useNavigation<AddCalendarTrackerNavigationProp>();

    const [value, setValue] = useState<string | null>(null);
    const [eventData, setEventData] = useState({
        user_id: 1,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
        repeating: false,
        repeat_timeline: '',
        description: ''
    });

    // Use Google Calendar Service
    const {
        promptAsync,
        request,
        googleEvents,
        fetchGoogleCalendarEvents,
        accessToken,
    } = useGoogleCalendar();

    // State to control the visibility of Date and Time pickers
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleChange = (name: string, value: any) => {
        setEventData({ ...eventData, [name]: value });
    };

    const handleSave = async () => {
        const formattedData = {
            ...eventData,
            event_date: eventData.event_date.toISOString().split('T')[0],
            event_time: eventData.event_time.toTimeString().split(' ')[0],
        };

        try {
            const response = await axios.post(IPAddr + '/add_calendar_events', formattedData);
            console.log('Event saved successfully:', response.data);

            // Sync event to Google Calendar if authenticated
            if (accessToken) {
                await syncToGoogleCalendar(formattedData);
            }

        } catch (error) {
            console.error('Error saving event:', error);
        }
        navigation.navigate('calendarEvents');
    };

    // Function to sync events to Google Calendar
    const syncToGoogleCalendar = async (eventData: any) => {
        if (!accessToken) return;

        try {
            await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    summary: eventData.title,
                    description: eventData.description,
                    start: {
                        dateTime: `${eventData.event_date}T${eventData.event_time}`,
                    },
                    end: {
                        dateTime: `${eventData.event_date}T${eventData.event_time}`, // Adjust the end time if needed
                    },
                }),
            });
            console.log('Event added to Google Calendar');
        } catch (error) {
            console.error('Error syncing event to Google Calendar:', error);
        }
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false); // Close Date Picker
        if (selectedDate) {
            handleChange('event_date', selectedDate); // Update Date if user selects
        }
    };

    const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
        setShowTimePicker(false); // Close Time Picker
        if (selectedTime) {
            handleChange('event_time', selectedTime); // Update Time if user selects
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={{ height: 100 }}></View>
            <View>
                <View style={styles.inLine}>
                    <Text style={styles.sectionHeader}>New Calendar Event</Text>
                    <TouchableOpacity style={{ marginLeft: 50 }}
                        onPress={() => console.log("pressed")}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                        <View style={styles.taskicon}>
                            <Ionicons name="walk-outline" size={30} color={'#000'} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Google Sign-In Button */}
                <Button
                    title="Login to Google"
                    disabled={!request}
                    onPress={() => promptAsync()} // Trigger Google Sign-In
                />

                {/* Show Google Events if fetched */}
                {googleEvents.length > 0 && (
                    <View>
                        <Text>Google Calendar Events:</Text>
                        {googleEvents.map((event, index) => (
                            <Text key={index}>{event.summary}</Text>
                        ))}
                    </View>
                )}

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
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <Text>{eventData.event_date.toDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
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
                        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                            <Text>{eventData.event_time.toTimeString().split(' ')[0]}</Text>
                        </TouchableOpacity>
                        {showTimePicker && (
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
                        <Text style={[styles.inputText, { alignSelf: 'baseline', top: 5 }]}>Description</Text>
                        <TextInput
                            style={styles.bigInput}
                            value={eventData.description}
                            onChangeText={(text) => handleChange('description', text)}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.saveCancelContainer}>
                <View style={styles.saveCancel}>
                    <Text style={styles.saveCancelText}>Cancel</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('calendarEvents')}
                        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
                    </TouchableOpacity>
                </View>
                <View style={styles.saveCancel}>
                    <Text style={styles.saveCancelText}>Save</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
