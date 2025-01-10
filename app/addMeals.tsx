import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { IPAddr, repeatingData } from './constants';
import GenericAddPageForm from './addEventPage';
import { cLog } from './log'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddMeals() {
  const [ingredients, setIngredients] = useState([]);
  const initialData = {
    userId: 1,
    title: '',
    event_date: new Date(),
    event_time: new Date(),
    ingredients: [],
  };

  const fetchIngredients = async () => {
    try {
      const response = await axios.get(IPAddr + '/get_ingredients/' +(await AsyncStorage.getItem('userId')));
      const fetchedIngredients = response.data.map((item: any) => ({
        label: item.ingredientName,
        value: item.id,
      }));
      setIngredients(fetchedIngredients); // Update state with fetched ingredients
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  // const addIngredient = async (newIngredient: string) => {
  //   try {
  //     const response = await axios.post(IPAddr + '/add_ingredients', { ingredient: newIngredient });
  //     const addedIngredient = response.data.ingredient;
  //   } catch (error) {
  //     console.error('Error adding new ingredient:', error);
  //   }
  // };


  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'event_date', label: 'Date', type: 'date' },
    { name: 'event_time', label: 'Time', type: 'time' },
    { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
    { name: 'ingredients', label: 'Ingredients', type: 'multi-select'},
  ];

  const handleSave = async (saveData: any) => {
    try {
      const payload = {
        ...saveData,
        repeating: Boolean(saveData.repeating),
        repeat_timeline: saveData.repeating,
        ingredients: saveData.ingredients.join(','),
      };
      cLog(payload);
      cLog('Payload:' + JSON.stringify(payload));
      const hit = IPAddr + '/add_meal_events';
      cLog('Saving event to:' + hit);
      const response = await axios.post(hit, payload);
      cLog('Event saved successfully:' + response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);
  cLog("AddMeals: Ingredients:", ingredients);
  return (
    <GenericAddPageForm
      title="New Meal"
      initialData={{ ...initialData, ingredients }} // Pass fetched ingredients as initial data
      fields={fields}
      mainPage="mealTracker"
      onSave={handleSave}
    />
  );
};

