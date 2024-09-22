import React from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";


export default function AddMeals({ navigation }) {
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
        </View>

      </View>
      <View>
        <View style={styles.inLine}>
          <Text style={styles.sectionHeader}>
            Grocery List Ingredients:
          </Text>
          <TouchableOpacity style={{ marginLeft: 50 }}
            onPress={() =>
              navigation.navigate('addMeals')}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
            <Ionicons name="add-circle-outline" size={30} color={'#000'} />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}
