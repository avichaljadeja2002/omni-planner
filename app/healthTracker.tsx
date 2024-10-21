import React, { useState, useEffect } from 'react';
import { Task } from '../components/Types'
import { IPAddr } from './constants';
import axios from 'axios';
import GenericMainPageForm from './mainPageTemplate';

export default function HealthTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchEvents = async () => {
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
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <GenericMainPageForm
      title='Health Tracker'
      header='Upcoming Events'
      nextPage='addHealthEvents'
      tasks={tasks}
    />
  );
}
