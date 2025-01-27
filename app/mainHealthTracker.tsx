import React from 'react';
import GenericMainPageForm from './genericMainPage';

export default function HealthTracker() {
  return (
    <GenericMainPageForm
      title='Health Tracker'
      nextPage='addHealthEvents'
      thisPage='mainHealthTracker'
      hitAddress={`/get_events/health/`}
      eventIconFunc={() => 'fitness-outline'}
    />
  );
}
