import React from 'react'
import { mealFields, mealInitialData, IPAddr } from '@/constants/constants';
import GenericAddPageForm from './genericAddEventPage';

export default function AddMeals() {
    return (
        <GenericAddPageForm
            title="New Meal"
            initialData={mealInitialData}
            fields={mealFields}
            mainPage="mainMealTracker"
            updateEndpoint={`${IPAddr}/add_meal_events`}
            fetchEndpoint={`${IPAddr}/get_ingredients`}
            keyValue={{'key':"id", "value":"ingredientName"}}
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

