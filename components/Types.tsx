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
    'mainPage': undefined;
    'mainHealthTracker': undefined;
    'mainMealTracker': undefined;
    'mainFinanceTracker': undefined;
    'mainCalendarEvents': undefined;
    'notes': undefined;
    'accountSetting': undefined;
    'addFinanceEvents': undefined,
    'addCalendarEvents': undefined;
    'addHealthEvents': undefined;
    'addMeals': undefined;
    'viewFinanceEvents': { event: Task };
    'viewHealthEvents': { event: Task };
    'viewMealEvents': { event: Task };
    'viewCalendarEvents': { event: Task };
  };

export type IconName = keyof typeof Ionicons.glyphMap;

export type UserInfo = {
  userId: string;
  email: string;
  phone: string;
  age: string;
  name: string;
  token: string;
};

export interface EventProps {
  eventIdFunc?: (event?: any) => string;
  eventTitleFunc?: (event?: any) => string;
  eventIconFunc: (event?: any) => string;
}

export interface GoogleCalendarProps {
  googleCalendar?: boolean;
  isGoogleCalendarLinked?: boolean;
  setIsGoogleCalendarLinked?: React.Dispatch<React.SetStateAction<boolean>>;
  handlePress?: () => void;
}

export interface NavigationProps {
  nextPage: keyof RootStackParamList;
  thisPage: keyof RootStackParamList;
}

export type GenericEventPageProps = {
  title: string;
  initialData?: any;
  fields: Field[];
  updateEndpoint: string;
  fetchEndpoint?: string;
  mainPage: string;
  keyValue?: { key: string; value: string };
  method?: string;
  mode: string
};


export type EventParams = {
  event: {
    event_date: string;
    event_time: string;
    repeat_timeline?: string;
    ingredients?: string;
    [key: string]: any;
  };
};

export interface Field {
  name: string;
  label: string;
  type: 'text' | 'date' | 'time' | 'dropdown' | 'multi-select' | 'number' | 'textarea';
  options?: { label: string; value: any }[];
}
