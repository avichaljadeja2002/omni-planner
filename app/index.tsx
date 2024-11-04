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
          icon: 'wallet-outline',
        }));
        setTasks(events);
      })
      .catch(error => console.error('Error fetching events:', error));
  }

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
