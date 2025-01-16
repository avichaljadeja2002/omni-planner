import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import App from './index';
import HealthTracker from './mainHealthTracker';
import MealTracking from './mainMealTracker';
import Notes from './notes';
import Finance from './mainFinanceTracker';
import CalendarEvents from './mainCalendarEvents';
import AccountSetting from './accountSetting';
import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';
import AddCalendarEvents from './addCalendarEvents';
import AddHealthEvents from './addHealthEvents';
import AddMeals from './addMeals';
import AddFinanceEvents from './addFinanceEvents';
import ViewFinanceEvents from './viewFinanceEvents';
import { NavigationContainer } from '@react-navigation/native';
import ViewHealthEvents from './viewHealthEvents';
import ViewCalendarEvents from './viewCalendarEvents';
import ViewMealEvents from './viewMealEvents';
import TaskScreen from './mainPage';
import { styles } from '@/assets/styles/styles';


const Stack = createStackNavigator<RootStackParamList>();
const CustomTopBar = ({ navigation }: StackHeaderProps) => {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.navigate('mainPage')}>
        <Ionicons name="home-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('mainHealthTracker')}>
        <Ionicons name="fitness-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('mainMealTracker')}>
        <Ionicons name="fast-food-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('accountSetting')}>
        <Ionicons name="person-circle-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('mainFinanceTracker')}>
        <Ionicons name="wallet-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('mainCalendarEvents')}>
        <Ionicons name="calendar-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('notes')}>
        <Ionicons name="pencil-outline" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default function Layout() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <CustomTopBar {...props} />,
          gestureEnabled: false,
          cardStyle: { backgroundColor: 'white' }
        }}
      >
        <Stack.Screen name="index" component={App} options={{ headerShown: false }} />
        <Stack.Screen name="mainPage" component={TaskScreen} />
        <Stack.Screen name="mainHealthTracker" component={HealthTracker} />
        <Stack.Screen name="mainMealTracker" component={MealTracking} />
        <Stack.Screen name="notes" component={Notes} />
        <Stack.Screen name="mainFinanceTracker" component={Finance} />
        <Stack.Screen name="accountSetting" component={AccountSetting} />
        <Stack.Screen name="addFinanceEvents" component={AddFinanceEvents} />
        <Stack.Screen name="mainCalendarEvents" component={CalendarEvents} />
        <Stack.Screen name="addCalendarEvents" component={AddCalendarEvents} />
        <Stack.Screen name="addHealthEvents" component={AddHealthEvents} />
        <Stack.Screen name="addMeals" component={AddMeals} />
        <Stack.Screen name="viewFinanceEvents" component={ViewFinanceEvents} />
        <Stack.Screen name="viewHealthEvents" component={ViewHealthEvents} />
        <Stack.Screen name="viewCalendarEvents" component={ViewCalendarEvents} />
        <Stack.Screen name="viewMealEvents" component={ViewMealEvents} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
