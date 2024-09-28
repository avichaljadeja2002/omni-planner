import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Props } from '../_layout'
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

export default function AddHealthEvents({ navigation }:Props) {
  const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
      if (value || isFocus) {
        return (
          <Text>
            Dropdown label
          </Text>
        );
      }
      return null;
    };
  return (
    <View style={styles.container}>
      <View style={{ height: 100 }}></View>
      <View>
        <View style={styles.inLine}>
          <Text style={styles.sectionHeader}>Add new Health Event</Text>
          <TouchableOpacity style={{ marginLeft: 50 }}
            onPress={() =>
              navigation.navigate('addMeals')}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <View style={styles.taskicon}>
              <Ionicons name="walk-outline" size={30} color={'#000'} />
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

          <View style={styles.inLine}>
            <Text style={styles.inputText}>
              Repeating
            </Text>
            <View style={styles.container}>
        {renderLabel()}
        <Dropdown
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <Ionicons
              name='accessibility-outline'
            />
          )}
        />
      </View>
          </View>

        </View>
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
