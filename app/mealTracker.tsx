import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Task } from '../components/Types'
import { IPAddr } from './constants'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/components/Types';

export default function MealTracker() {
  type CalendarTrackerNavigationProp = StackNavigationProp<RootStackParamList, 'addMeals'>;
  const navigation = useNavigation<CalendarTrackerNavigationProp>();

  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(IPAddr + '/get_meal_events/1');
      const data = await response.json();

      const events = data.map((event: any) => ({
        id: event.id.toString(),
        title: `${event.title} at ${event.event_time}`,
        done: false,
        icon: 'pizza-outline',
      }));

      setTasks(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDayPress = (day: { dateString: React.SetStateAction<string>; }) => {
    setSelectedDate(day.dateString);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.bullet}>
        <View style={styles.taskicon}>
          <Ionicons name={item.icon} size={30} color={'#000'}></Ionicons>
        </View>
      </Text>
      <Text style={styles.taskText}>{item.title}</Text>
      <View>
        <BouncyCheckbox
          fillColor="#65558F"
          iconStyle={{ borderRadius: 0 }}
          innerIconStyle={{ borderRadius: 0, borderWidth: 2 }}
          onPress={(isChecked: boolean) => { item.done = isChecked }} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
      <Text style={styles.headerText}>Meal Tracker</Text>
        <Text style={styles.sectionHeader}>Upcoming Meals</Text>
      </View>
      <FlatList style={styles.flatList}
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
      <View style={{ height: 50 }}></View>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: '#9b59b6',
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#9b59b6',
          todayTextColor: '#00adf5',
          arrowColor: '#9b59b6',
        }}
      />
      <TouchableOpacity style={styles.fixedButton}
        onPress={() =>
          navigation.navigate('addMeals')}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
        <View style={styles.icon}>
          <Ionicons name="add-outline" size={40} color={'#eee'} />
        </View>
      </TouchableOpacity>


    </View>
  );
}
