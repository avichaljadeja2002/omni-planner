import React from 'react';
import GenericEventPage from './genericViewEventPage';
import { IPAddr, healthFields } from '../constants/constants';

export default function ViewHealthEvents() {
  return (
    <GenericEventPage
      title="Health Event"
      fields={healthFields}
      updateEndpoint={`${IPAddr}/update_health_event`}
      mainPage="mainHealthTracker"
    />
  );
}
