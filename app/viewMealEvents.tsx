import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IPAddr, repeatingData } from './constants';
import { cLog } from './log'
import GenericViewPageForm from './viewEventPage';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/components/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ViewEventsRouteProp = RouteProp<RootStackParamList, 'viewMealEvents'>;

export default function ViewMealEvents() {
    const [allIngredients, setIngredients] = useState([]);
    const route = useRoute<ViewEventsRouteProp>();
    const { event } = route.params;
    cLog("Passed event:", event);
    const fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'event_date', label: 'Date', type: 'date' },
        { name: 'event_time', label: 'Time', type: 'time' },
        { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
        { name: 'ingredients', label: 'Ingredients', type: 'multi-select' },
    ];
    const handleSave = async (saveData: any) => {
        try {
            const payload = {
                ...saveData,
                ingredients: saveData.ingredients.join(','),
            };
            cLog("Save Data:", payload);
            const hit = IPAddr + '/update_meal_event';
            cLog('Updating event with:' + hit);
            const response = await axios.put(hit, payload);
            cLog('Event updated successfully:' + response.data);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const fetchIngredients = async () => {
        try {
            const response = await axios.get(IPAddr + '/get_ingredients/'+(await AsyncStorage.getItem('userId')));
            const fetchedIngredients = response.data.map((item: any) => ({
                label: item.ingredientName,
                value: item.id,
            }));
            setIngredients(fetchedIngredients); // Update state with fetched ingredients
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };


    useEffect(() => {
        fetchIngredients();
    }, []);

    let eventDate = event.event.event_date;
    if (event.event.event_date != event.event.event_time) {
        const dateTimeString = `${event.event.event_date}T${event.event.event_time}`;
        eventDate = new Date(dateTimeString);
    }
    cLog("Ingredients:", allIngredients);
    if (event.event['ingredients'] && !Array.isArray(event.event['ingredients'])) event.event['ingredients'] = event.event['ingredients'].split(',').map((id: string) => parseInt(id, 10));
    if (eventDate) event.event['event_date'] = eventDate;
    if (eventDate) event.event['event_time'] = eventDate;
    if (event.event['repeat_timeline']) event.event['repeat_timeline'] = parseInt(event.event['repeat_timeline'], 10);
    if (event.event['repeat_timeline'] !== undefined) event.event['repeating'] = event.event['repeat_timeline'] !== 0;

    return (
        <GenericViewPageForm
            title="Meal Event"
            initialData={{ ...event.event, allIngredients }}
            fields={fields}
            mainPage='mealTracker'
            onSave={handleSave}
        />
    );
}