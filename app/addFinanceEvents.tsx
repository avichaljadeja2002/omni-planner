import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IPAddr } from './constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';

const data = [
    { label: 'Daily', value: '1' },
    { label: 'Weekly', value: '2' },
    { label: 'Monthly', value: '3' },
    { label: 'Yearly', value: '4' },
];

export default function AddFinanceEvents() {
    type AddFinanceTrackerNavigationProp = StackNavigationProp<RootStackParamList, 'addFinanceEvents'>;
    const navigation = useNavigation<AddFinanceTrackerNavigationProp>();

    const [value, setValue] = useState<string | null>(null);

    const [eventData, setEventData] = useState({
        user_id: 1,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
        repeating: false,
        repeat_timeline: '',
        money: 0.0
    });


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
            const response = await axios.post(IPAddr + '/add_finance_events', formattedData);
            console.log('Event saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving event:', error);
        }
        navigation.navigate('finance')
    };

    const handleDateChange = (event: any, selectedDate: any) => {
        if (selectedDate) {
            handleChange('event_date', selectedDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime: any) => {
        if (selectedTime) {
            handleChange('event_time', selectedTime);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ height: 100 }}></View>
            <View>
                <View style={styles.inLine}>
                    <Text style={styles.sectionHeader}>New Finance Event</Text>
                    <TouchableOpacity style={{ marginLeft: 50 }}
                        onPress={() => console.log("pressed")}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                        <View style={styles.taskicon}>
                            <Ionicons name="wallet-outline" size={30} color={'#000'} />
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
                        <View style={styles.dateTime}>
                            <DateTimePicker
                                value={eventData.event_date}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />

                            <DateTimePicker
                                value={eventData.event_time}
                                mode="time"
                                display="default"
                                onChange={handleTimeChange}
                            />
                        </View>
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
                        <Text style={[styles.inputText, { alignSelf: 'baseline', top: 5 }]}>Money</Text>
                        <TextInput
                            style={styles.input}
                            value={eventData.money.toString()}
                            onChangeText={(text) => handleChange('money', text)}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.saveCancelContainer}>
                <View style={styles.saveCancel}>
                    <Text style={styles.saveCancelText}>Cancel</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('finance')}
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
        </View>
    );
}
