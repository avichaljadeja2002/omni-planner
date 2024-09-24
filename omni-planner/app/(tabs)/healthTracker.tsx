import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Task } from '../../components/Types'
import { Props } from '../_layout'

export default function HealthTracker({ navigation }: Props) {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks] = useState<Task[]>([
    { id: "1", title: "Walk the dog at 5pm", done: true },
    { id: "2", title: "Gym at 7pm", done: true },
    { id: "3", title: "Therapy at 10pm", done: true },
  ]);

  const handleDayPress = (day: { dateString: React.SetStateAction<string>; }) => {
    setSelectedDate(day.dateString);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.taskText}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Health</Text>
      </View>

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

      <View style={styles.inLine}>
        <Text style={styles.sectionHeader}>Upcoming Events</Text>
        <TouchableOpacity style={{ marginLeft: 150 }}
          onPress={() =>
            navigation.navigate('addHealthEvents')}
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
          <Ionicons name="add-circle-outline" size={30} color={'#000'} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
