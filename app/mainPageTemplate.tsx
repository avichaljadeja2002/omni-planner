import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Calendar } from 'react-native-calendars';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Task } from '../components/Types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface FormProps {
    title: string;
    page: keyof RootStackParamList;
    nextPage: keyof RootStackParamList
    tasks: Array<Task>;
  }

const GenericMainPageForm: React.FC<FormProps> = ({ title, page, nextPage, tasks }) => {
    const [selectedDate, setSelectedDate] = useState('');

    type Prop = StackNavigationProp<RootStackParamList, typeof page>;
    const navigation = useNavigation<Prop>();  

    const handleDayPress = (day: { dateString: React.SetStateAction<string>; }) => {
        setSelectedDate(day.dateString);
    };

    const renderTask = ({ item }: { item: Task }) => (
        <View style={styles.taskItem}>
            <Text style={styles.bullet}>
                <View style={styles.taskicon}>
                    <Ionicons name={item.icon} size={30} color={'#000'} />
                </View>
            </Text>
            <Text style={styles.taskText}>{item.title}</Text>
            <View>
                <BouncyCheckbox
                    fillColor="#65558F"
                    iconStyle={{ borderRadius: 0 }}
                    innerIconStyle={{ borderRadius: 0, borderWidth: 2 }}
                    onPress={(isChecked: boolean) => { item.done = isChecked; }} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.headerText}>{title}</Text>
                <Text style={styles.sectionHeader}>Upcoming Events</Text>
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
                onPress={() => navigation.navigate(nextPage)}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                <View style={styles.icon}>
                    <Ionicons name="add-outline" size={40} color={'#eee'} />
                    <Text style={styles.newText}>New</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
export default GenericMainPageForm;
