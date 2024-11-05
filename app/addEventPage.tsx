import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { styles } from './styles';
import { RootStackParamList } from '@/components/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from 'expo-router';

interface FormProps {
  title: string;
  initialData: any;
  fields: Array<{ name: string; label: string; type: string; options?: any }>;
  mainPage: keyof RootStackParamList;
  onSave: (data: any) => void;
}

const GenericAddPageForm: React.FC<FormProps> = ({ title, initialData, fields, mainPage, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  type TrackerNavigationProp = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
  const navigation = useNavigation<TrackerNavigationProp>();

  const handleChange = (name: string, value: any) => {
    console.log('Setting', name, 'to', value);
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name: string, event: any, selectedDate: any) => {
    if (selectedDate) {
      handleChange(name, selectedDate);
    }
  };

  const handleSave = () => {
    console.log('Saving event:', formData);
    const formattedData = {
      ...formData,
      event_date: formData.event_date.toISOString().split('T')[0],
      event_time: formData.event_time.toTimeString().split(' ')[0],
      repeating: formData.repeat_timeline && formData.repeat_timeline,
      repeat_timeline: formData.repeat_timeline,
    
    };
    onSave(formattedData);
    navigation.navigate(mainPage)
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>{title}</Text>
      {fields.map((field, index) => (
        <View key={index} style={styles.inputContainer}>
          <View style={field.type === 'textarea' ? styles.inLineDescription : styles.inLine}>
            <Text style={styles.inputText}>{field.label}</Text>
            {field.type === 'text' && (
              <TextInput
                style={[styles.input, { height: 50 }]}
                value={formData[field.name]}
                onChangeText={(text) => handleChange(field.name, text)}
                placeholder={field.label}
              />
            )}
            {field.type === 'date' && (
              <View style={styles.dateTime}>
                <DateTimePicker
                  value={formData[field.name]}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => handleDateChange(field.name, event, selectedDate)}
                  style={{ flex: 1 }}
                />
              </View>
            )}
            {field.type === 'time' && (
              <View style={styles.dateTime}>
                <DateTimePicker
                  value={formData[field.name]}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => handleDateChange(field.name, event, selectedTime)}
                  style={{ flex: 1 }}
                />
              </View>
            )}
            {field.type === 'dropdown' && (
              <Dropdown
                style={[styles.dropdown, { height: 50, width: '80%' }]}
                data={field.options}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={formData[field.name]}
                onChange={(item) => handleChange(field.name, item.value)}
                placeholder="Select"
              />
            )}
            {field.type === 'textarea' && (
              <TextInput
                style={styles.bigInput}
                value={formData[field.name]}
                onChangeText={(text) => handleChange(field.name, text)}
                multiline
                placeholder={field.label}
              />
            )}
            {field.type === 'number' && (
              <TextInput
                style={[styles.input, { height: 50 }]}
                value={formData[field.name]}
                onChangeText={(text) => handleChange(field.name, text)}
                placeholder={field.label}
                keyboardType="numeric"
              />
            )}
          </View>
        </View>
      ))}
      <View style={styles.saveCancelContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate(mainPage)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default GenericAddPageForm;
