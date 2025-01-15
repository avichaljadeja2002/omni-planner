import React from 'react';
import GenericAddViewEventForm from './genericAddViewEventPage';
import { IPAddr, financeFields } from '@/constants/constants';
import { RouteProp, useRoute } from '@react-navigation/native';
import { EventParams, RootStackParamList } from '@/components/Types';
import { cLog } from './log';

export default function ViewFinanceEvents() {
  const route = useRoute<RouteProp<RootStackParamList, any>>();
  const { event } = route.params as EventParams;
  cLog("Event:");
  cLog(event);
  return (
    <GenericAddViewEventForm
      title="Finance Event"
      fields={financeFields}
      initialData={event}
      updateEndpoint={`${IPAddr}/update_finance_event`}
      mainPage="mainFinanceTracker"
      method="PUT"
    /> 
  );
}
