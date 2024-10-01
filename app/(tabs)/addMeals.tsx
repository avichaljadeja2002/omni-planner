import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Platform } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Props } from '../_layout'
import axios from 'axios';
import { IPAddr } from './constants';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function AddMeals({ navigation }: Props) {
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const [eventData, setEventData] = useState({
    user_id: 1,
    title: '',
    event_date: new Date(),
    event_time: new Date(),
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
      const response = await axios.post(IPAddr + '/add_meal_events', formattedData);
      console.log('Event saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
    navigation.navigate('mealTracking')
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
          <Text style={styles.sectionHeader}>Add new Meal</Text>
          <TouchableOpacity style={{ marginLeft: 50 }}
            onPress={() =>
              console.log("pressed")}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <View style={styles.taskicon}>
              <Ionicons name="pizza-outline" size={30} color={'#000'} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inLine}>
            <Text style={styles.inputText}>
              Title
            </Text>
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

        </View>

      </View>
      <View>
        <View style={styles.inLine}>
          <Text style={styles.sectionHeader}>
            Ingredients
          </Text>
          <TouchableOpacity style={{ marginLeft: 50 }}
            onPress={() =>
              console.log("pressed")}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
            <Ionicons name="add-circle-outline" size={30} color={'#000'} />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
        />
        <TextInput
          style={styles.input}
        />
      </View>
      <View style={styles.saveCancelContainer}>
                <View style={styles.saveCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('mealTracking')}
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
