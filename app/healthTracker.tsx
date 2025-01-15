import React from 'react';
import GenericMainPageForm from './genericMainPage';

export default function HealthTracker() {
  return (
    <GenericMainPageForm
      title='Health Tracker'
      nextPage='addHealthEvents'
      thisPage='healthTracker'
      hitAddress={`/get_health_events/`}
      eventIconFunc={() => 'fitness-outline'}
    />
  );
}
