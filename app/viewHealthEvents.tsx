import React from 'react';
import GenericViewEventForm from './genericViewEventPage';
import { IPAddr, healthFields } from '@/constants/constants';

export default function ViewHealthEvents() {
  return (
    <GenericViewEventForm
      title="Health Event"
      fields={healthFields}
      updateEndpoint={`${IPAddr}/update_health_event`}
      mainPage="mainHealthTracker"
    />
  );
}
