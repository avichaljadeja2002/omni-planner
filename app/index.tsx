import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { styles } from './styles';
import { RootStackParamList, Task } from '../components/Types'
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';


export default function TaskScreen() {
  type IndexNavigation = StackNavigationProp<RootStackParamList, 'index'>;
  const navigation = useNavigation<IndexNavigation>();

  const [selectedDate, setSelectedDate] = useState('');
  const [tasks] = useState<Task[]>([
    { id: "1", title: "Meet with Saayeh at 5pm", done: true, icon: 'accessibility' },
    { id: "2", title: "Doctor's appointment at 7pm", done: true, icon: 'accessibility' },
    { id: "3", title: "AI HW due at 11:59pm", done: true, icon: 'accessibility' },
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
      <View>
        <Text style={styles.headerText}>Home</Text>
        <Text style={styles.sectionHeader}>Welcome [user]</Text>
      </View>

      <FlatList style={styles.flatList}
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
      <View style={{ height: 50 }}>
        <Text style={styles.sectionHeader}>Title</Text>
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
          selectedDayBackgroundColor: '#65558F',
          todayTextColor: '#00adf5',
          arrowColor: '#9b59b6',
        }}
      />
      <TouchableOpacity style={styles.fixedButton}
        onPress={() =>
          console.log("pressed")}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
        <View style={styles.icon}>
          <Ionicons name="add-outline" size={40} color={'#eee'} />
          <Text style={styles.newText}>New</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
