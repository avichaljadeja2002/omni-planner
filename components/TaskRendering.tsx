import React, { useState } from 'react';
import { View, Text} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { styles } from '../../app/(tabs)/styles';
import { Ionicons } from "@expo/vector-icons";
import { Task } from '../components/Types'

export const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.bullet}>
        <View style={styles.taskicon}>
          <Ionicons name={item.icon} size={30} color={'#000'}></Ionicons>
        </View>
      </Text>
      <Text style={styles.taskText}>{item.title}</Text>
      <View>
        <BouncyCheckbox
          fillColor="#65558F"
          iconStyle={{ borderRadius: 0 }}
          innerIconStyle={{ borderRadius: 0, borderWidth: 2 }}
          onPress={(isChecked: boolean) => { item.done = isChecked }} />
      </View>
    </View>
  );