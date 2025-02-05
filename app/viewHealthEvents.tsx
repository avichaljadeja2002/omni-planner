import React from 'react';
import GenericAddViewEventForm from './genericAddViewEventPage';
import { healthFields } from '@/constants/constants';

export default function ViewHealthEvents() {
  return (
    <GenericAddViewEventForm
      title="Health Event"
      fields={healthFields}
      updateEndpoint={`/update_event/health`}
      mainPage="mainHealthTracker"
      method="PUT"
      mode='view'
    />
  );
}
