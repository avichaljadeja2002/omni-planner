import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { styles } from './styles';

export default function HealthTracker() {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks] = useState([
    { id: "1", title: "Meet with Saayeh at 5pm", done: true },
    { id: "2", title: "Doctor's appointment at 7pm", done: true },
    { id: "3", title: "AI HW due at 11:59pm", done: true },
  ]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.taskText}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
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

      <Text style={styles.sectionHeader}>Things to do today</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
