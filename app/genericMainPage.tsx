import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import {
  EventProps,
  GoogleCalendarProps,
  NavigationProps,
  RootStackParamList,
  Task,
} from '@/components/Types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { cLog } from '../components/log';
import { getPageFromEventType, getPageName, IPAddr } from '@/constants/constants';
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
  setIsGoogleCalendarLinked = () => {},
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true); 
  type Prop = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
  const navigation = useNavigation<Prop>();

  const handleDayPress = (day: { dateString: React.SetStateAction<string> }) => {
    setSelectedDate(day.dateString);
  };

  const handleViewPress = (item: Task) => {
    const route = { ...item, thisPage };
    cLog(1, { 'Pre-Route': route });
    if (route.thisPage === 'mainPage') {
      route.thisPage = getPageFromEventType(
        route.event.event_type
      ) as keyof RootStackParamList;
    }
    cLog(1, { 'Route': route });
    navigation.navigate(getPageName(route.thisPage) as any, { event: route });
  };

  const complete_task = async (itemId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }
      const url = `/complete_event/${itemId}/${token}`;
      const response = await call(url, 'PUT'); 
  
      if (response.status === 200 && response.data) {
        console.log(`Task ${itemId} completed. Refreshing list.`);
        fetchEvents(); 
      } else {
         Alert.alert('Error', response.data?.message || 'Failed to complete event.');
      }
    } catch (error) {
      console.error('Error completing events:', error);
      Alert.alert('Error', 'An error occurred while completing the event.');
    }
  };
  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskItem} onPress={() => handleViewPress(item)}>
      <View style={styles.taskicon}>
        <Ionicons name={item.icon} size={30} color={'#000'} />
      </View>
      <Text style={styles.taskText}>{item.title}</Text>
      <BouncyCheckbox
        fillColor="#65558F"
        iconStyle={{ borderRadius: 0 }}
        innerIconStyle={{ borderRadius: 0, borderWidth: 2 }}
        onPress={(isChecked: boolean) => {
          item.done = isChecked;
          console.log(item.id);
          complete_task(item.id);
        }}
      />
    </TouchableOpacity>
  );

  const fetchEvents = async () => {
    setLoading(true); 
    try {
      const token = await AsyncStorage.getItem('token');
      cLog(1, token);
      const response = await call(`${hitAddress}${token}`, 'GET');

      if (response.status === 200 && response.data) {
        const { events, googleCalendarLinked } = response.data;
        if (googleCalendar) {
          setIsGoogleCalendarLinked(googleCalendarLinked);
        }
        const eventsArray = Array.isArray(events) ? events : response.data;
        cLog(1, { 'eventsArray': eventsArray });
        const formattedEvents = eventsArray
          .map((event: any) => ({
            id: eventIdFunc(event),
            title: eventTitleFunc(event),
            done: false,
            icon: eventIconFunc(event) as Task['icon'],
            event: event,
          }))
          .slice(0, sliceRange);

        setTasks(formattedEvents);
      } else {
        console.error('Failed to fetch events');
        Alert.alert('Error', 'Failed to fetch events.'); 
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Error fetching events.'); 
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const verifyLoginStatus = async () => {
        const [isLoggedIn, token] = await AsyncStorage.multiGet([
          'isLoggedIn',
          'token',
        ]);
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

        {loading ? (
          <ActivityIndicator size="large" color="#9b59b6" />
        ) : tasks?.length > 0 ? (
          <FlatList
            style={styles.flatList}
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => `${item.id}-${item.event.event_type}`}
          />
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            No events found.
          </Text>
        )}

        <View style={{ height: 15 }}></View>
        <View style={styles.toggleContainer}>
          <Text style={styles.calendarHeader}>Events</Text>
          <TouchableOpacity onPress={() => setIsCalendarVisible(!isCalendarVisible)}>
            <Ionicons
              name={
                isCalendarVisible
                  ? 'chevron-down-outline'
                  : 'chevron-forward-outline'
              }
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    bigContainer: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      paddingHorizontal: 25,
      backgroundColor: "#ffffff",
      paddingTop: 10,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    headerText: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333',
      alignSelf: 'center',
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    sectionHeader: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
      alignSelf: "center",
    },
    flatList: {
      height: 250,
      flexGrow: 1,
    },
    taskItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      backgroundColor: "#FEF7FF",
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    taskicon: {
      borderRadius: 50,
      height: 50,
      width: 50,
      backgroundColor: "#EADDFF",
      justifyContent: "center",
      alignItems: "center",
    },
    taskText: {
      flex: 1,
      fontSize: 18,
      color: "#555",
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      padding: 5,
    },
    calendarHeader: {
      textAlign: "center",
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
    },
    linkButton: {
      backgroundColor: "#4285F4",
      paddingVertical: 12,
      paddingHorizontal: 25,
      width: '75%',
      marginTop: 0,
      borderRadius: 8,
      alignItems: "center",
    },
    linkButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    smallButton: {
      marginLeft: 20,
    },
    smallIcon: {
      borderRadius: 20,
      height: 40,
      width: 40,
      backgroundColor: "#65558F",
      justifyContent: "center",
      alignItems: "center",
    },
  });
export default GenericMainPageForm;
