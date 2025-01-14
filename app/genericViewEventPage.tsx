import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MultiSelect from 'react-native-multiple-select';
import { Dropdown } from 'react-native-element-dropdown';
import { getUserId, IPAddr, repeatingData } from './constants';
import { cLog } from './log';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/components/Types';

export interface Field {
  name: string;
  label: string;
  type: 'text' | 'date' | 'time' | 'dropdown' | 'multi-select' | 'number' | 'textarea';
  options?: { label: string; value: any }[];
}

type EventParams = {
  event: {
    event_date: string;
    event_time: string;
    repeat_timeline?: string;
    ingredients?: string;
    [key: string]: any;
  };
};

type GenericEventPageProps = {
  title: string;
  fields: Field[];
  updateEndpoint: string;
  fetchEndpoint?: string;
  mainPage: string;
};

const GenericEventPage = ({
  title,
  fields,
  updateEndpoint,
  fetchEndpoint,
  mainPage,
}: GenericEventPageProps) => {
  const [formData, setFormData] = useState<any>({});
  const [additionalData, setAdditionalData] = useState<any>([]);
  const route = useRoute<RouteProp<RootStackParamList, any>>();
  const { event } = route.params as EventParams;

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      if (id !== null) {
        setUserId(Number(id));
      }
    };

    fetchUserId();
  }, []);
  const handleSave = async (saveData: any) => {
    try {
      cLog('Save Data:', saveData);
      const response = await axios.put(updateEndpoint, saveData);
      cLog('Event updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const fetchAdditionalData = async () => {
    if (!fetchEndpoint) return;
    try {
      const response = await axios.get(fetchEndpoint);
      setAdditionalData(response.data);
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

    setFormData(event.event);
  }, [event]);

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSave = () => {
    cLog("Saving data:", formData);
    setFormData({ ...formData, userId: userId });
    handleSave(formData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {fields.map((field) => {
        switch (field.type) {
          case 'text':
            return (
              <View key={field.name} style={styles.field}>
                <Text>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  value={formData[field.name]}
                  onChangeText={(value) => handleChange(field.name, value)}
                />
              </View>
            );
          case 'date':
          case 'time':
            return (
              <View key={field.name} style={styles.field}>
                <Text>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  value={formData[field.name]?.toString()}
                  onChangeText={(value) => handleChange(field.name, value)}
                  placeholder={field.type === 'date' ? 'YYYY-MM-DD' : 'HH:MM'}
                />
              </View>
            );
          case 'dropdown':
            return (
              <View key={field.name} style={styles.field}>
                <Text>{field.label}</Text>
                <Dropdown
                  style={{ height: 50, width: '80%' }}
                  data={field.options || []}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={formData[field.name]}
                  onChange={(item: { label: string; value: any }) =>
                    handleChange(field.name, item.value)
                  }
                  placeholder="Select"
                />
              </View>

            );
          case 'multi-select':
            return (
              <View key={field.name} style={styles.field}>
                <Text>{field.label}</Text>
                {/* <MultiSelect
                  items={field.options || []}
                  uniqueKey="value"
                  selectedItems={formData[field.name] || []}
                  onSelectedItemsChange={(selected) => handleChange(field.name, selected)}
                  selectText="Choose items"
                  searchInputPlaceholderText="Search items..."
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="label"
                  searchInputStyle={{ color: '#CCC' }}
                  submitButtonColor="#48d22b"
                  submitButtonText="Submit"
                /> */}
              </View>
            );
          case 'number':
            {
              return (
                <View key={field.name} style={styles.field}>
                  <Text>{field.label}</Text>
                  <TextInput
                    style={[styles.input, { height: 50 }]}
                    value={formData[field.name]}
                    onChangeText={(text) => handleChange(field.name, text)}
                    placeholder={field.label}
                    keyboardType="numeric"
                  />
                </View>
              )
            }
          case 'textarea':
            {
              return (
                <View key={field.name} style={styles.field}>
                  <Text>{field.label}</Text>
                  <TextInput
                    value={formData[field.name]}
                    onChangeText={(text) => handleChange(field.name, text)}
                    multiline
                    placeholder={field.label}
                  />
                </View>
              )
            }
          default:
            return null;
        }
      })}
      <Button title="Save" onPress={handleFormSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  field: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});

export default GenericEventPage;
