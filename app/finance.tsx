import { IPAddr, formatTime } from './constants';
import { Task } from '../components/Types';
import axios from 'axios';
import GenericMainPageForm from './mainPageTemplate';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { cLog } from './log'

export default function FinanceTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchEvents = async () => {
    const hit = IPAddr + '/get_finance_events/1';
    cLog('Fetching finance events from:' + hit);
    axios.get(hit)
      .then(response => {
        const events = response.data.map((event: any) => ({
          id: event.id.toString(),
          title: `${event.title} at ${event.event_date}, ${formatTime(event.event_time)}`,
          done: false,
          icon: 'wallet-outline',
        }));
        setTasks(events);
      })
      .catch(error => console.error('Error fetching events:', error));
  }

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );
 
  return (
    <GenericMainPageForm
      title='Finance Tracker'
      header='Upcoming Events'
      nextPage='addFinanceEvents'
      tasks={tasks}
    />);
}
