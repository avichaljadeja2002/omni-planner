import React from 'react'
import { mealFields } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

function roundTimeQuarterHour() {
    var timeToReturn = new Date();

    timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 15) * 15);
    return timeToReturn;
}

export default function AddMeals() {
    const mealInitialData = {
        title: '',
        event_date: new Date().toISOString().split('T')[0],
        event_time: roundTimeQuarterHour().toTimeString().split(' ')[0],
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

