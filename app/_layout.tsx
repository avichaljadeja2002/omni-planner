import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import App from './index';
import HealthTracker from './healthTracker';
import MealTracking from './mealTracker';
import Finance from './finance';
import CalendarEvents from './calendarEvents';
import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';
import AddCalendarEvents from './addCalendarEvents';
import AddHealthEvents from './addHealthEvents';
import AddMeals from './addMeals';
import AddFinanceEvents from './addFinanceEvents';


const Stack = createStackNavigator<RootStackParamList>();

const CustomTopBar = ({ navigation }: StackHeaderProps) => {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.navigate('index')}>
        <Ionicons name="home-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('healthTracker')}>
        <Ionicons name="fitness-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('mealTracker')}>
        <Ionicons name="fast-food-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('finance')}>
        <Ionicons name="wallet-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('calendarEvents')}>
        <Ionicons name="calendar-outline" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default function Layout() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomTopBar {...props} />,
        gestureEnabled: false,
        cardStyle: { backgroundColor: 'white'}
      }}
    >
      <Stack.Screen name="index" component={App} />
      <Stack.Screen name="healthTracker" component={HealthTracker} />
      <Stack.Screen name="mealTracker" component={MealTracking} />
      <Stack.Screen name="finance" component={Finance} />
      <Stack.Screen name="addFinanceEvents" component={AddFinanceEvents} />
      <Stack.Screen name="calendarEvents" component={CalendarEvents} />
      <Stack.Screen name="addCalendarEvents" component={AddCalendarEvents} />
      <Stack.Screen name="addHealthEvents" component={AddHealthEvents} />
      <Stack.Screen name="addMeals" component={AddMeals} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  topBar: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
});
