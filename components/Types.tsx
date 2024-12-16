import { Ionicons } from "@expo/vector-icons";

export type Task = {
    id: string;
    title: string;
    done: boolean;
    icon: IconName
  };

export type RootStackParamList = {
    'index': undefined;
    'healthTracker': undefined;
    'mealTracker': undefined;
    'notes': undefined;
    'finance': undefined;
    'addFinanceEvents': undefined,
    'calendarEvents': undefined;
    'addCalendarEvents': undefined;
    'addHealthEvents': undefined;
    'addMeals': undefined
  };
  

export type IconName = keyof typeof Ionicons.glyphMap;
