import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Calendar } from 'react-native-calendars';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Task } from '../components/Types'
import { IPAddr } from './constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export default function HealthTracker() {
  type HealthNavProp = StackNavigationProp<RootStackParamList, 'addMeals'>;
  const navigation = useNavigation<HealthNavProp>();  


  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const fetchEvents = async () => {
    try {
      const response = await fetch(IPAddr + '/get_health_events/1'); 
      const data = await response.json();
      
      const events = data.map((event: any) => ({
        id: event.id.toString(),
        title: `${event.title} at ${event.event_time}`, 
        done: false,
        icon: 'calendar-outline',
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
      <View style={{ height: 100 }}></View>

      <View>
        <Text style={styles.headerText}>Health Tracker</Text>
        <Text style={styles.sectionHeader}>Upcoming Events</Text>
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
          selectedDayBackgroundColor: '#65558F',
          todayTextColor: '#00adf5',
          arrowColor: '#9b59b6',
        }}
      />
      <TouchableOpacity style={styles.fixedButton}
        onPress={() =>
          navigation.navigate('addHealthEvents')}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
        <View style={styles.icon}>
          <Ionicons name="add-outline" size={40} color={'#eee'} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
