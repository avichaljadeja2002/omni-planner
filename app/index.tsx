// import { IPAddr } from './constants';
// import axios from 'axios';
import GenericMainPageForm from './mainPageTemplate';
import React, { useState, useCallback } from 'react';
import { formatTime, IPAddr } from './constants';
import { Task } from '../components/Types';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { cLog } from './log'

export default function TaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const fetchAllEvents = async () => {
    const hit = IPAddr + '/get_all_events/1';
    cLog('Fetching all events from:' + hit);
    axios.get(hit)
      .then(response => {
        const events = response.data.map((event: any) => ({
          id: event.id.toString(),
          title: `${event.title} at ${event.eventDate}, ${formatTime(event.eventTime)}`,
          done: false,
          icon: getEventIcon(event.event_type), 
        })).slice(0,10);;
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
      header='Welcome Saayeh!'
      nextPage='index'
      tasks={tasks}
    />
  );
}
