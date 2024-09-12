import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs

      screenOptions={{
        headerShown: false,
        // Dark/Light Theme setup
        tabBarStyle: {height: 90},
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveBackgroundColor: Colors[colorScheme ?? 'light'].background,
        tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].tabBarActiveBackgroundColor
      }}>

      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={'home'} color={color} style={[{bottom: -4}]} />
          ),
        }}
      />

      {/* Discorver Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={'code-slash'} color={color} style={[{bottom: -4}]} />
          ),
        }}
      />

      {/* Add Tab */}
      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={'add-circle-outline'} color={color} size={40} style={[{bottom: -4}]}/>
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={'options'} color={color} style={[{bottom: -4}]} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='person-outline' color={color} style={[{bottom: -4}]} />
          ),
        }}
      />

    </Tabs>
  );
}
