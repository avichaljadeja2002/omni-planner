import React from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Props } from '../_layout'

export default function AddMeals({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={{ height: 100 }}></View>
      <View>
        <View style={styles.inLine}>
          <Text style={styles.sectionHeader}>Add new Meal</Text>
          <TouchableOpacity style={{ marginLeft: 50 }}
            onPress={() =>
              navigation.navigate('addMeals')}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <View style={styles.taskicon}>
              <Ionicons name="pizza-outline" size={30} color={'#000'} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inLine}>
            <Text style={styles.inputText}>
              Title
            </Text>
            <TextInput
              style={styles.input}
            />
          </View>

          <View style={styles.inLine}>
            <Text style={styles.inputText}>
              Date
            </Text>
            <TextInput
              style={styles.input}
            />
          </View>

          <View style={styles.inLine}>
            <Text style={styles.inputText}>
              Time
            </Text>
            <TextInput
              style={styles.input}
            />
          </View>

        </View>

      </View>
      <View>
        <View style={styles.inLine}>
          <Text style={styles.sectionHeader}>
            Ingredients
          </Text>
          <TouchableOpacity style={{ marginLeft: 50 }}
            onPress={() =>
              console.log("pressed")}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
            <Ionicons name="add-circle-outline" size={30} color={'#000'} />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
        />
        <TextInput
          style={styles.input}
        />
      </View>
      <View style={styles.saveCancelContainer}>
        <View style={styles.saveCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('mealTracking')}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
            <Ionicons name='close-circle-outline' size={30} color={'#000'} />
          </TouchableOpacity>
        </View>
        <View style={styles.saveCancel}>
          <Text style={styles.saveText}>Save</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('mealTracking')}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
            <Ionicons name="save-outline" size={30} color={'#000'} />
          </TouchableOpacity>
        </View>

      </View>

    </View>
  );
}
