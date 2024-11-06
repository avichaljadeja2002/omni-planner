// import { IPAddr } from './constants';
// import axios from 'axios';
import GenericMainPageForm from './mainPageTemplate';
import React, { useState, useCallback } from 'react';
import { IPAddr } from './constants';
import { Task } from '../components/Types';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

export default function TaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const fetchAllEvents = async () => {
    axios.get(IPAddr + '/get_all_events/1')
      .then(response => {
        const events = response.data.map((event: any) => ({
          id: event.id.toString(),
          title: `${event.title} at ${event.eventTime}`,
          done: false,
          icon: getEventIcon(event.event_type), 
        }));
        setTasks(events);
      })
      .catch(error => console.error('Error fetching events:', error));
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'finance':
        return 'wallet-outline';
      case 'calendar':
        return 'calendar-outline';
      case 'health':
        return 'fitness-outline';
      case 'meal':
        return 'fast-food-outline';
      default:
        return 'help-outline';
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllEvents();
    }, [])
  );

  return (
    <GenericMainPageForm
      title='Home'
      header='Welcome [user]'
      nextPage='index'
      tasks={tasks}
    />
  );
}
