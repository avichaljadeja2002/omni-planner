import { IPAddr } from './constants';
import { Task } from '../components/Types';
import axios from 'axios';
import GenericMainPageForm from './mainPageTemplate';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function FinanceTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchEvents = async () => {
    axios.get(IPAddr + '/get_finance_events/1')
      .then(response => {
        const events = response.data.map((event: any) => ({
          id: event.id.toString(),
          title: `${event.title} at ${event.event_time}`,
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
