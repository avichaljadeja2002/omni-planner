import React, { useState, useCallback } from 'react';
import { formatTime, IPAddr } from './constants';
import { Task } from '../components/Types';
import axios from 'axios';
import GenericMainPageForm from './mainPageTemplate';
import { useFocusEffect } from '@react-navigation/native';
import { cLog } from './log'

export default function HealthTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchEvents = async () => {
    const hit = IPAddr + '/get_health_events/1';
    cLog('Fetching health events from:' + hit);
    axios.get(hit)
      .then(response => {
        const events = response.data.map((event: any) => ({
          id: event.id.toString(),
          title: `${event.title} at ${event.event_date}, ${formatTime(event.event_time)}`,
          done: false,
          icon: 'fitness-outline',
        })).slice(0,10);;
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
