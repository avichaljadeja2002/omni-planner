import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Calendar } from 'react-native-calendars';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Task } from '../components/Types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { cLog } from './log';
import { getPageName } from './constants';
// import { cLog } from './log';

interface FormProps {
    title: string;
    header: string;
    nextPage: keyof RootStackParamList;
    thisPage: keyof RootStackParamList;
    tasks: Array<Task>;
}

const GenericMainPageForm: React.FC<FormProps> = ({ title, header, nextPage, thisPage, tasks }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [isCalendarVisible, setIsCalendarVisible] = useState(true); 

    type Prop = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<Prop>();

    const handleDayPress = (day: { dateString: React.SetStateAction<string>; }) => {
        setSelectedDate(day.dateString);
    };

    const handleViewPress = (item: Task) => {
        // cLog(item);
        const route = { ...item, thisPage };
        // if(thisPage === 'index')
        cLog("Route:",route);
        navigation.navigate(getPageName(route.thisPage) as any, { event: route });
    }

    const renderTask = ({ item }: { item: Task }) => (
        <TouchableOpacity style={styles.taskItem} onPress={() => handleViewPress(item)}>
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
                    onPress={(isChecked: boolean) => { item.done = isChecked; }}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View>
                <View style={{ height: 12 }}></View>
                <Text style={styles.headerText}>{title}</Text>
                <Text style={styles.sectionHeader}>{header}</Text>
            </View>
            <FlatList
                style={styles.flatList}
                data={tasks}
                renderItem={renderTask}
                keyExtractor={(item) => item.id}
            />
            <View style={{ height: 15 }}></View>
            <View style={styles.toggleContainer}>
                <Text style={styles.calendarHeader}>Events</Text>
                <TouchableOpacity onPress={() => setIsCalendarVisible(!isCalendarVisible)}>
                    <Ionicons
                    name={isCalendarVisible ? "chevron-down-outline" : "chevron-forward-outline"}
                    size={24}
                    color="#9b59b6"
                    />
                </TouchableOpacity>
            </View>
            {isCalendarVisible && (
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
            )}
            {title !== 'Home' &&
                <TouchableOpacity
                    style={styles.fixedButton}
                    onPress={() => navigation.navigate(nextPage as any)}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <View style={styles.icon}>
                        <Ionicons name="add-outline" size={40} color={'#eee'} />
                    </View>
                </TouchableOpacity>
            }
        </View>
    );
};

export default GenericMainPageForm;
