import React from 'react'
import axios from 'axios';
import { IPAddr } from './constants';
import { RootStackParamList } from '../components/Types';
import { useNavigation } from '@react-navigation/native';
import GenericAddPageForm from './addEventPage';
import { StackNavigationProp } from '@react-navigation/stack';


export default function AddMeals() {
  type AddMealTrackerNavigationProp = StackNavigationProp<RootStackParamList, 'addMeals'>;
  const navigation = useNavigation<AddMealTrackerNavigationProp>();

  const initialData = {
    user_id: 1,
    title: '',
    event_date: new Date(),
    event_time: new Date(),
  };

  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'event_date', label: 'Date', type: 'date' },
    { name: 'event_time', label: 'Time', type: 'time' },
  ];

  const handleSave = async (saveData: any) => {
    try {
      const response = await axios.post(IPAddr + '/add_meal_events', saveData);
      console.log('Event saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
    navigation.navigate('mealTracker')
  };


  const handleCancel = (() => {
    navigation.navigate('mealTracker')
  })

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

