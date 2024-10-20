import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { styles } from './styles';

interface FormProps {
  title: string;
  initialData: any;
  fields: Array<{ name: string; label: string; type: string; options?: any }>;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const GenericForm: React.FC<FormProps> = ({ title, initialData, fields, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData);
  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name: string, event: any, selectedDate: any) => {
    if (selectedDate) {
      handleChange(name, selectedDate);
    }
  };

  const handleSave = () => {
    const formattedData = {
      ...formData,
      event_date: formData.event_date.toISOString().split('T')[0],
      event_time: formData.event_time.toTimeString().split(' ')[0],
    };
    onSave(formattedData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>{title}</Text>
      {fields.map((field, index) => (
        <View key={index} style={styles.inputContainer}>
          <View style={styles.inLine}>
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
                onChange={(item) => handleChange(field.name, item.label)}
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
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.saveCancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveCancelText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GenericForm;
