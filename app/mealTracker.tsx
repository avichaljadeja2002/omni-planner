import React from 'react';
import GenericMainPageForm from './genericMainPage';

export default function MealTracker() {
  return (
    <GenericMainPageForm
      title="Meal Tracker"
      header="Upcoming Meals"
      nextPage="addMeals"
      thisPage="mealTracker"
      hitAddress={`/get_meal_events/`}
      eventIconFunc={() => 'fast-food-outline'}
    />
  );
}
