import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { cLog } from './log';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { EventParams, GenericEventPageProps, RootStackParamList } from '@/components/Types';
import { styles } from '@/assets/styles/styles';
import MultiSelect from 'react-native-multiple-select';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GenericEventPage = ({
  title,
  fields,
  mainPage,
  updateEndpoint,
  fetchEndpoint,
  keyValue,
}: GenericEventPageProps) => {
  const [formData, setFormData] = useState<any>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [additionalData, setAdditionalData] = useState<any>([]);
  const [currentField, setCurrentField] = useState<string | null>(null); 

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, any>>();
  const { event } = route.params as EventParams;

  const handleSave = async () => {
    try {
      const formattedData = {
        ...formData,
        event_date: formData.event_date?.toISOString().split('T')[0],
        event_time: formData.event_time?.toTimeString().split(' ')[0],
        repeating: Boolean(formData.repeat_timeline && formData.repeat_timeline),
        repeat_timeline: formData.repeat_timeline,
        userId: await AsyncStorage.getItem('userId'),
        ingredients: formData.ingredients?.join(','),
      };
      cLog('Save Data:', formattedData);
      const response = await axios.put(updateEndpoint, formattedData);
      cLog('Event updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating event:', error);
    }
    navigation.navigate(mainPage as any);
  };

  const handleDateChange = (name: string, selectedDate: any) => {
    if (selectedDate) {
      handleChange(name, selectedDate);
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (name: string, event: any, selectedTime: any) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
    } else if (selectedTime) {
      handleChange(name, selectedTime);
    }
  };

  const showPicker = (type: 'date' | 'time', fieldName: string) => {
    setCurrentField(fieldName);
    if (type === 'date') {
      setShowDatePicker(true);
    } else {
      setShowTimePicker(true);
    }
  };

  const fetchAdditionalData = async () => {
    if (!fetchEndpoint) return;
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`${fetchEndpoint}/${userId}`);
      const formattedData = response.data.map((item: { [x: string]: any; id: any; name: any; }) => ({
        value: keyValue ? item[keyValue.key] : item.id,
        label: keyValue ? item[keyValue.value] : item.name,
      }));
      setAdditionalData(formattedData);
      cLog('Fetched and formatted data:', formattedData);
    } catch (error) {
      console.error('Error fetching additional data:', error);
    }
  };

  useEffect(() => {
    fetchAdditionalData();
    let eventDate = event.event.event_date;
    if (event.event.event_date !== event.event.event_time) {
      const dateTimeString = `${event.event.event_date}T${event.event.event_time}`;
      eventDate = new Date(dateTimeString);
    }

    if (eventDate) {
      event.event['event_date'] = eventDate;
      event.event['event_time'] = eventDate;
    }

    if (event.event['repeat_timeline']) {
      event.event['repeat_timeline'] = parseInt(event.event['repeat_timeline'], 10);
      event.event['repeating'] = event.event['repeat_timeline'] !== 0;
    }

    const parsedIngredients = event.event.ingredients
      ? event.event.ingredients.split(',').map((item: string) => parseInt(item, 10))
      : [];

    setFormData({ ...event.event, ingredients: parsedIngredients });
  }, [event]);

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const getIngredientNames = (selectedItems: any[]) => {
    const filteredItems = additionalData.filter((item: { value: any }) => selectedItems.includes(item.value));
    return filteredItems.map((item: { label: any }) => item.label);
  };

  // Helper function to render different field types
  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            style={[styles.input, { height: 50 }]}
            value={formData[field.name]}
            onChangeText={(text) => handleChange(field.name, text)}
            placeholder={field.label}
          />
        );
      case 'date':
        return (
          <View style={styles.dateTimeInLine}>
            <TouchableOpacity onPress={() => showPicker('date', field.name)}>
              <Text style={{ textAlign: 'left' }}>
                {formData[field.name] ? formData[field.name].toDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={currentField ? formData[currentField] || new Date() : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => handleDateChange(currentField!, selectedDate)}
              />
            )}
          </View>
        );
      case 'multi-select':
        return (
          <MultiSelect
            items={additionalData}
            uniqueKey="value"
            selectedItems={Array.isArray(formData["ingredients"]) ? formData["ingredients"] : getIngredientNames(event.event.ingredients.split(',').map((item: string) => parseInt(item, 10)))}
            onSelectedItemsChange={(selectedItems) => handleChange("ingredients", selectedItems)}
            selectText="Select Ingredients"
            searchInputPlaceholderText="Search Ingredients..."
            displayKey="label"
            styleDropdownMenuSubsection={styles.dropdown}
          />
        );
      case 'time':
        return (
          <View style={styles.dateTimeInLine}>
            <TouchableOpacity onPress={() => showPicker('time', field.name)}>
              <Text style={{ textAlign: 'left' }}>
                {formData[field.name] ? formData[field.name].toLocaleTimeString() : 'Select Time'}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                minuteInterval={15}
                value={currentField ? formData[currentField] || new Date() : new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => handleTimeChange(currentField!, event, selectedTime)}
              />
            )}
          </View>
        );
      case 'dropdown':
        return (
          <Dropdown
            style={[styles.dropdown, { height: 50, width: '80%' }]}
            data={field.options || []}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={formData[field.name]}
            onChange={(item) => handleChange(field.name, item.value)}
            placeholder="Select"
          />
        );
      case 'textarea':
        return (
          <TextInput
            style={styles.bigInput}
            value={formData[field.name]}
            onChangeText={(text) => handleChange(field.name, text)}
            multiline
            placeholder={field.label}
          />
        );
      case 'number':
        return (
          <TextInput
            style={[styles.input, { height: 50 }]}
            value={formData[field.name]}
            onChangeText={(text) => handleChange(field.name, text)}
            placeholder={field.label}
            keyboardType="numeric"
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.addContainer}>
      <Text style={styles.sectionHeader}>{title}</Text>
      <View>
        {fields.map((field, index) => (
          <View key={index} style={styles.inputContainer}>
            <View style={field.type === 'textarea' ? styles.inLineDescription : styles.inLine}>
              <Text style={styles.inputText}>{field.label}</Text>
              {renderField(field)}
            </View>
          </View>
        ))}
      </View>
      <View style={styles.saveCancelContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate(mainPage as any)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default GenericEventPage;
