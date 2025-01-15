import React from 'react';
import GenericAddViewEventForm from './genericAddViewEventPage';
import { IPAddr, healthFields } from '@/constants/constants';

export default function ViewHealthEvents() {
  return (
    <GenericAddViewEventForm
      title="Health Event"
      fields={healthFields}
      updateEndpoint={`${IPAddr}/update_health_event`}
      mainPage="mainHealthTracker"
      method="PUT"
    />
  );
}
