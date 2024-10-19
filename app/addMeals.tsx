import React from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { IPAddr } from './constants';
import GenericForm from './addEventPage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';


const AddMeals = () => {
  type AddMealParams = StackNavigationProp<RootStackParamList, 'mealTracker'>;
  const navigation = useNavigation<AddMealParams>();

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

  const handleSave = async (data: any) => {
    try {
      const response = await axios.post(IPAddr + '/add_meal_events', data);
      console.log('Event saved successfully:', response.data);
      navigation.navigate('mealTracker');
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleCancel = () => {
    navigation.navigate('mealTracker')
  };

  return (
    <GenericForm
      title="New Meal"
      initialData={initialData}
      fields={fields}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default AddMeals;
