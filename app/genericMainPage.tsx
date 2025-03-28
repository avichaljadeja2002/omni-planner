import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Calendar } from 'react-native-calendars';
import { styles } from '@/assets/styles/styles';
import { Ionicons } from "@expo/vector-icons";
import { EventProps, GoogleCalendarProps, NavigationProps, RootStackParamList, Task } from '@/components/Types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { cLog } from '../components/log';
import { getPageFromEventType, getPageName } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { call } from '../components/apiCall';

interface FormProps extends EventProps, GoogleCalendarProps, NavigationProps {
    title: string;
    header?: string;
    hitAddress: string;
    sliceRange?: number;
}

const GenericMainPageForm: React.FC<FormProps> = ({
    title,
    header = 'Upcoming Events',
    nextPage,
    thisPage,
    hitAddress,
    googleCalendar = false,
    eventIdFunc = (event) => event.id.toString(),
    eventTitleFunc = (event) => `${event.title}`,
    eventIconFunc,
    handlePress,
    sliceRange = 10,
    isGoogleCalendarLinked = false,
    setIsGoogleCalendarLinked = () => { },
}) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [isCalendarVisible, setIsCalendarVisible] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);

    type Prop = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<Prop>();

    const handleDayPress = (day: { dateString: React.SetStateAction<string>; }) => {
        setSelectedDate(day.dateString);
    };

    const handleViewPress = (item: Task) => {
        const route = { ...item, thisPage };
        cLog(1, { "Pre-Route": route });
        if (route.thisPage === 'mainPage') {
            route.thisPage = getPageFromEventType(route.event.event_type) as keyof RootStackParamList;
        }
        cLog(1, { "Route": route });
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

    const fetchEvents = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            cLog(1, token)
            const response = await call(`${hitAddress}${token}`, 'GET');

            if (response.status === 200 && response.data) {
                const { events, googleCalendarLinked } = response.data;
                if (googleCalendar) {
                    setIsGoogleCalendarLinked(googleCalendarLinked);
                }
                const eventsArray = Array.isArray(events) ? events : response.data;
                cLog(1, { 'eventsArray': eventsArray });
                const formattedEvents = eventsArray.map((event: any) => ({
                    id: eventIdFunc(event),
                    title: eventTitleFunc(event),
                    done: false,
                    icon: eventIconFunc(event) as Task['icon'],
                    event: event,
                })).slice(0, sliceRange);

                setTasks(formattedEvents);
            } else {
                console.error('Failed to fetch events');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const verifyLoginStatus = async () => {
                const [isLoggedIn, token] = await AsyncStorage.multiGet(['isLoggedIn', 'token']);
                if (isLoggedIn[1] === 'true' && token[1]) {
                    cLog(1, `User is logged in with Token: ${token[1]}`);
                }
            };

            const initializeEvents = async () => {
                await fetchEvents();
            };

            initializeEvents();
            verifyLoginStatus();
        }, [])
    );

    return (
        <View style={styles.bigContainer}>
            <View style={styles.container}>
                <View>
                    <View style={{ height: 12 }}></View>
                    <Text style={styles.headerText}>{title}</Text>
                    <View>
                        <View style={{ height: 12 }}></View>
                        <View style={styles.headerRow}>
                            <Text style={styles.sectionHeader}>{header}</Text>
                            {title !== 'Home' && (
                                <TouchableOpacity
                                    style={styles.smallButton}
                                    onPress={() => navigation.navigate(nextPage as any)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <View style={styles.smallIcon}>
                                        <Ionicons name="add-outline" size={20} color={'#eee'} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                </View>
                <FlatList
                    style={styles.flatList}
                    data={tasks}
                    renderItem={renderTask}
                    keyExtractor={(item) => `${item.id}-${item.event.event_type}`}
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
            </View>
            {googleCalendar && !isGoogleCalendarLinked && (
                <View style={{ alignItems: 'center', marginBottom: 25 }}>
                    <TouchableOpacity style={styles.linkButton} onPress={handlePress}>
                        <Text style={styles.linkButtonText}>Link to Google Calendar</Text>
                    </TouchableOpacity>
                </View>)
            }
        </View>
    );
};

export default GenericMainPageForm;
