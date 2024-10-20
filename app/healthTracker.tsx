import React, { useState, useCallback } from 'react';
import { IPAddr } from './constants';
import { Task } from '../components/Types';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import GenericMainPageForm from './mainPageTemplate';

export default function HealthTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useFocusEffect(
    useCallback(() => {
      getEvents();
    }, [])
  );

  const getEvents = (() => {
    axios.get(IPAddr + '/get_health_events/1')
    .then(response => {
      const events = response.data.map((event: any) => ({
        id: event.id.toString(),
        title: `${event.title} at ${event.event_time}`,
        done: false,
        icon: 'calendar-outline',
      }));
      setTasks(events);
    })
    .catch(error => console.error('Error fetching events:', error));
  })

  return (
    <GenericMainPageForm
            title='Health Tracker'
            page='healthTracker'
            nextPage='addHealthEvents'
            tasks={tasks}
        />
  );
}
