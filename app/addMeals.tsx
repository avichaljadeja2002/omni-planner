import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import { IPAddr } from './constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../components/Types';
import { useNavigation } from '@react-navigation/native';
import GenericAddPageForm from './addEventPage';
import { StackNavigationProp } from '@react-navigation/stack';


export default function AddMeals() {
  type CalendarTrackerNavigationProp = StackNavigationProp<RootStackParamList, 'addMeals'>;
  const navigation = useNavigation<CalendarTrackerNavigationProp>();

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
      event_date: eventData.event_date.toISOString().split('T')[0],
      event_time: eventData.event_time.toTimeString().split(' ')[0],
    };

    try {
      const response = await axios.post(IPAddr + '/add_meal_events', formattedData);
      console.log('Event saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
    navigation.navigate('mealTracker')
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    if (selectedDate) {
      handleChange('event_date', selectedDate);
    }
  };
  return (
    <GenericAddPageForm
      title="New Meal"
      initialData={initialData}
      fields={fields}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
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
          <Text style={styles.sectionHeader}>New Meal</Text>
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
          <Text style={styles.saveCancelText}>Cancel</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('mealTracker')}
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
