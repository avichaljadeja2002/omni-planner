import React, { useCallback, useState } from 'react';
import { getPageName, IPAddr, repeatingData } from './constants';
import GenericAddPageForm from './addEventPage';
import { cLog } from './log'
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/components/Types';
import axios from 'axios';

type ViewEventsRouteProp = RouteProp<RootStackParamList, 'viewEvents'>;

export default function ViewCalendarEvents() {
  const [ingredients, setIngredients] = useState([]);
  const route = useRoute<ViewEventsRouteProp>();
  const { event } = route.params;
  cLog(event);
  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'event_date', label: 'Date', type: 'date' },
    { name: 'event_time', label: 'Time', type: 'time' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
    { name: 'money', label: 'Money', type: 'number' },
    { name: 'ingredients', label: 'Ingredients', type: 'multi-select' },
  ];


  cLog(fields);
  const filteredFields = fields
    .filter(field => field.name in event.event) // Keep only fields where name exists in data
    .map(field => ({ ...field, value: event.event[field.name] })); // Attach value from data

  const orderedValues = Object.keys(event.event)
    .filter(key => fields.some(field => field.name === key))
    .reduce((obj: { [key: string]: any }, key) => {
      obj[key] = event.event[key];
      return obj;
    }, {});

  const dateTimeString = `${orderedValues.event_date}T${orderedValues.event_time}`;
  const eventDate = new Date(dateTimeString);

  const fetchIngredients = async () => {
    const hit = IPAddr + '/get_ingredients/13';
    cLog('Fetching ingredients from:' + hit);
    axios.get(hit)
      .then(response => {
        const fetchedIngredients = response.data.map((item: any) => ({
          label: item.ingredientName,
          value: item.id,
        }));
        setIngredients(fetchedIngredients);
      })
      .catch(error => console.error('Error fetching ingredients:', error));
  };

  useFocusEffect(
    useCallback(() => {
      fetchIngredients();
    }, [])
  );

  // Assign values only if they exist
  if (eventDate) orderedValues['event_date'] = eventDate;
  if (eventDate) orderedValues['event_time'] = eventDate;
  if (orderedValues['repeat_timeline']) orderedValues['repeat_timeline'] = parseInt(orderedValues['repeat_timeline'], 10);
  if (orderedValues['repeat_timeline'] !== undefined) orderedValues['repeating'] = orderedValues['repeat_timeline'] !== 0;
  if (event?.event?.userId !== undefined) orderedValues['user_id'] = event.event.userId;

  if (event?.event?.ingredients) {
    orderedValues['usedIngredients'] = event.event.ingredients.split(",").map(Number); // Convert string to array of numbers
  }

  cLog("Ordered Values", orderedValues);
  cLog("Filtered Fields", filteredFields);
  const handleSave = async (saveData: any) => {
    // try {
    //   // Format date and time before sending
    //   const payload = {
    //     ...saveData,
    //     repeating: Boolean(saveData.repeating),
    //     repeat_timeline: saveData.repeating
    //   };
    //   cLog(payload);
    //   const hit = IPAddr + '/add_calendar_event';
    //   cLog('Saving event to:' + hit);
    //   const response = await axios.post(hit, payload);
    //   cLog('Event saved successfully:' + response.data);
    // } catch (error) {
    //   console.error('Error saving event:', error);
    // }
    cLog(saveData)
  };

  return (
    <GenericAddPageForm
      title={`View ${getPageName(event.thisPage)} Event`}
      initialData={{ ...orderedValues, ingredients }}
      fields={filteredFields}
      mainPage={event.thisPage}
      onSave={handleSave}
    />
  );
}
