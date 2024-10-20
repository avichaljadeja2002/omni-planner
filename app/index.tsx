import React, { useState } from 'react';
import { Task } from '../components/Types'
// import { IPAddr } from './constants';
// import axios from 'axios';
import GenericMainPageForm from './mainPageTemplate';


export default function TaskScreen() {
  const [tasks] = useState<Task[]>([
    { id: "1", title: "Meet with Saayeh at 5pm", done: true, icon: 'accessibility' },
    { id: "2", title: "Doctor's appointment at 7pm", done: true, icon: 'accessibility' },
    { id: "3", title: "AI HW due at 11:59pm", done: true, icon: 'accessibility' },
  ]);

  // useEffect(() => {
  //   fetchEvents();
  // }, []);

  return (
    <GenericMainPageForm
      title='Home'
      header='Welcome [user]'
      nextPage='index'
      tasks={tasks}
    />
  );
}
