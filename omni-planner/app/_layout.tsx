import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import App from './(tabs)/index';
import HealthTracker from './(tabs)/healthTracker';
import MealTracking from './(tabs)/mealTracker';
import Finance from './(tabs)/finance';
import CalendarEvents from './(tabs)/calendarEvents';
import AddMeals from './(tabs)/addMeals';
import AddHealthEvents from './(tabs)/addHealthEvents';

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator>
        <Drawer.Screen
          name="home"
          component={App}
          options={{
            title: 'Home',
            drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
          }}
        />
        <Drawer.Screen
          name="healthTracking"
          component={HealthTracker}
          options={{
            title: 'Health Tracking',
            drawerIcon: ({ color }) => <Ionicons name="fitness-outline" size={22} color={color} />,
          }}
        />

        <Drawer.Screen
          name="mealTracking"
          component={MealTracking}
          options={{
            title: 'Food Tracker',
            drawerIcon: ({ color }) => <Ionicons name="fast-food-outline" size={22} color={color} />,
          }}
        />

        <Drawer.Screen
          name="finance"
          component={Finance}
          options={{
            title: 'Finance',
            drawerIcon: ({ color }) => <Ionicons name="wallet-outline" size={22} color={color} />,
          }}
        />

        <Drawer.Screen
          name="calendarEvents"
          component={CalendarEvents}
          options={{
            title: 'Calendar Events',
            drawerIcon: ({ color }) => <Ionicons name="calendar-outline" size={22} color={color} />,
          }}
        />

        <Drawer.Screen
          name="addMeals"
          component={AddMeals}
          options={{
            title: 'Add New Meal',
            drawerItemStyle: { display: 'none' }
          }}
        />
        
        <Drawer.Screen
          name="addHealthEvents"
          component={AddHealthEvents}
          options={{
            title: 'Add New Health Event',
            drawerItemStyle: { display: 'none' }
          }}
        />

      </Drawer.Navigator>
    </NavigationContainer>
  );
}
