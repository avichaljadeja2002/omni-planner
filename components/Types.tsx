import { Ionicons } from "@expo/vector-icons";

export type Task = {
    id: string;
    title: string;
    done: boolean;
    icon: IconName;
    event: any;
  };

export type RootStackParamList = {
    'index': undefined;
    'home': undefined;
    'healthTracker': undefined;
    'mealTracker': undefined;
    'notes': undefined;
    'finance': undefined;
    'accountSetting': undefined;
    'addFinanceEvents': undefined,
    'calendarEvents': undefined;
    'addCalendarEvents': undefined;
    'addHealthEvents': undefined;
    'addMeals': undefined;
    'viewFinanceEvents': { event: Task };
    'viewHealthEvents': { event: Task };
    'viewMealEvents': { event: Task };
    'viewCalendarEvents': { event: Task };
  };
  

export type IconName = keyof typeof Ionicons.glyphMap;
