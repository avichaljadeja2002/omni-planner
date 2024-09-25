import React from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Props } from '../_layout'

export default function AddHealthEvents({ navigation }:Props) {
  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text>
            Name:
          </Text>
          <TextInput
            style={styles.input}
          />
          <Text>
            Date:
          </Text>
          <TextInput
            style={styles.input}
          />
          <Text>
            Time:
          </Text>
          <TextInput
            style={styles.input}
          />
          <Text>
            Health Goal:
          </Text>
          <TextInput
            style={styles.input}
          />
          <Text>
            # Calories Burned:
          </Text>
          <TextInput
            style={styles.input}
          />
          <Text>
            Repeat:
          </Text>
          <TextInput
            style={styles.input}
          />
        </View>

      </View>
      <View>
        <TouchableOpacity style={styles.centerButton}
          onPress={() =>
            navigation.navigate('healthTracking')}
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
          <Ionicons name="save-outline" size={30} color={'#000'} />
        </TouchableOpacity>
      </View>

    </View>
  );
}
