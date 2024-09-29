import { Ionicons } from "@expo/vector-icons";

export type Task = {
    id: string;
    title: string;
    done: boolean;
    icon: IconName
  };

export type IconName = keyof typeof Ionicons.glyphMap;