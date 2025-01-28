import React from 'react'
import { mealFields } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

export default function AddMeals() {
    const mealInitialData = {
        title: '',
        event_date: new Date().toISOString().split('T')[0],
        event_time: new Date().toTimeString().split(' ')[0],
        ingredients: '',
    };
    return (
        <GenericAddViewPageForm
            title="New Meal"
            initialData={mealInitialData}
            fields={mealFields}
            mainPage="mainMealTracker"
            updateEndpoint={`/add_event/meal`}
            fetchEndpoint={`/get_ingredients`}
            keyValue={{ 'key': "id", "value": "ingredientName" }}
        />
    );
};

// const addIngredient = async (newIngredient: string) => {
//   try {
//     const response = await call('/add_ingredients', 'POST', { ingredient: newIngredient });
//     const addedIngredient = response.data.ingredient;
//   } catch (error) {
//     console.error('Error adding new ingredient:', error);
//   }
// };

