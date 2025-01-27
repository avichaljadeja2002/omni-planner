import React from 'react';
import GenericMainPageForm from './genericMainPage';

export default function MealTracker() {
  return (
    <GenericMainPageForm
      title="Meal Tracker"
      header="Upcoming Meals"
      nextPage="addMeals"
      thisPage="mainMealTracker"
      hitAddress={`/get_events/meal/`}
      eventIconFunc={() => 'fast-food-outline'}
    />
  );
}
