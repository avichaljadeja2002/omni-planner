import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import App from './(tabs)/index';
import HealthTracker from './(tabs)/healthTracker';
import MealTracking from './(tabs)/mealTracker';
import Finance from './(tabs)/finance';
import CalendarEvents from './(tabs)/calendarEvents';
import AddMeals from './(tabs)/addMeals';
import AddHealthEvents from './(tabs)/addHealthEvents';

const Drawer = createDrawerNavigator();

type IconName = keyof typeof Ionicons.glyphMap | null;

const drawerScreens = [
  {
    name: 'home',
    component: App,
    title: 'Home',
    icon: 'home-outline' as IconName,
  },
  {
    name: 'healthTracking',
    component: HealthTracker,
    title: 'Health Tracking',
    icon: 'fitness-outline' as IconName,
  },
  {
    name: 'mealTracking',
    component: MealTracking,
    title: 'Food Tracker',
    icon: 'fast-food-outline' as IconName,
  },
  {
    name: 'finance',
    component: Finance,
    title: 'Finance',
    icon: 'wallet-outline' as IconName,
  },
  {
    name: 'calendarEvents',
    component: CalendarEvents,
    title: 'Calendar Events',
    icon: 'calendar-outline' as IconName,
  },
  {
    name: 'addMeals',
    component: AddMeals,
    title: 'Add New Meal',
    icon: null,
    hidden: true,
  },
  {
    name: 'addHealthEvents',
    component: AddHealthEvents,
    title: 'Add New Health Event',
    icon: null,
    hidden: true,
  },
];

type RootDrawerParamList = {
  [key in typeof drawerScreens[number]['name']]: undefined;
};

export interface Props {
  navigation: DrawerNavigationProp<RootDrawerParamList>;
}

export default function Layout() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator>
        {drawerScreens.map(({ name, component, title, icon, hidden }) => (
          <Drawer.Screen
            key={name}
            name={name}
            component={component}
            options={{
              title,
              drawerIcon: icon ? ({ color }) => <Ionicons name={icon} size={22} color={color} /> : undefined,
              drawerItemStyle: hidden ? { display: 'none' } : undefined,
            }}
          />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}