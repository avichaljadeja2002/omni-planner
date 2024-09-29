import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Props } from '../_layout'
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: 'Daily', value: '1' },
  { label: 'Weekly', value: '2' },
  { label: 'Monthly', value: '3' },
  { label: 'Yearly', value: '4' },
];

export default function AddHealthEvents({ navigation }: Props) {
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{ height: 100 }}></View>
      <View>
        <View style={styles.inLine}>
          <Text style={styles.sectionHeader}>Add new Health Event</Text>
          <TouchableOpacity style={{ marginLeft: 50 }}
            onPress={() =>
              console.log("pressed")}
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

              <Dropdown
                style={{width: 200, borderWidth: 1, padding: 8}}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={value}
                onChange={item => {
                  setValue(item.value);
                  setIsFocus(false);
                }}
                renderLeftIcon={() => (
                  <Ionicons
                    name='calendar-outline'
                    size={20}
                    paddingRight={10}
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
