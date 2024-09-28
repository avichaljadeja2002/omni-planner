import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Calendar } from 'react-native-calendars';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Task } from '../../components/Types'
import { Props } from '../_layout'

export default function HealthTracker({ navigation }: Props) {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks] = useState<Task[]>([
    { id: "1", title: "Walk the dog at 5pm", done: true, icon: 'walk-outline' },
    { id: "2", title: "Gym at 7pm", done: true, icon: 'barbell-outline' },
    { id: "3", title: "Therapy at 10pm", done: true, icon: 'chatbubbles-outline' },
  ]);

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
      {/* Temporary View until navigation system gets added vvv */}
      <View style={{ height: 100 }}></View>

      <View>
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
