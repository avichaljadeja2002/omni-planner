import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";

export default function MealTracker({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks] = useState([
    { id: "1", title: "Breakfast at 8:00am", done: true },
    { id: "2", title: "Lunch at 12:30pm", done: true },
    { id: "3", title: "Dinner at 6:00pm", done: true },
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
        <Text style={styles.headerText}>Meals</Text>
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
        <Text style={styles.sectionHeader}>Upcoming Meals</Text>
        <TouchableOpacity style={{ marginLeft: 150 }}
          onPress={() =>
            navigation.navigate('addMeals')}
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
