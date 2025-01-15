import React from 'react'
import { mealFields } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

export default function AddMeals() {
    const mealInitialData = {
        userId: 0,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
        ingredients: '',
      };
    return (
        <GenericAddViewPageForm
            title="New Meal"
            initialData={mealInitialData}
            fields={mealFields}
            mainPage="mainMealTracker"
            updateEndpoint={`/add_meal_events`}
            fetchEndpoint={`/get_ingredients`}
            keyValue={{'key':"id", "value":"ingredientName"}}
            method="POST"
        />
    );
};

  // const addIngredient = async (newIngredient: string) => {
  //   try {
  //     const response = await axios.post(IPAddr + '/add_ingredients', { ingredient: newIngredient });
  //     const addedIngredient = response.data.ingredient;
  //   } catch (error) {
  //     console.error('Error adding new ingredient:', error);
  //   }
  // };
 
