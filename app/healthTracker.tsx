import React, { useState, useCallback } from 'react';
import { IPAddr } from './constants';
import { Task } from '../components/Types';
import axios from 'axios';
import GenericMainPageForm from './mainPageTemplate';
import { useFocusEffect } from '@react-navigation/native';

export default function HealthTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchEvents = async () => {
    axios.get(IPAddr + '/get_health_events/1')
      .then(response => {
        const events = response.data.map((event: any) => ({
          id: event.id.toString(),
          title: `${event.title} at ${event.event_time}`,
          done: false,
          icon: 'fitness-outline',
        }));
        setTasks(events);
      })
      .catch(error => console.error('Error fetching events:', error));
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  return (
    <GenericMainPageForm
      title='Health Tracker'
      header='Upcoming Events'
      nextPage='addHealthEvents'
      tasks={tasks}
    />
  );
}
