import React, { useCallback, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { cLog } from '../components/log';
import {
  GenericEventPageProps,
  RootStackParamList,
} from '@/components/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  useNavigation,
  useFocusEffect,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { call } from '../components/apiCall';
import { FontAwesome } from '@expo/vector-icons';
import Alert from './alert';
import { useAlert } from '@/hooks/useAlert';

const GenericAddViewPageForm: React.FC<GenericEventPageProps> = ({
  title,
  initialData = {},
  fields,
  mainPage,
  updateEndpoint,
  fetchEndpoint,
  keyValue,
  method = 'POST',
  mode,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [additionalData, setAdditionalData] = useState<any>([]);
  const [currentField, setCurrentField] = useState<string | null>(null);

  const { alertModal, showAlert, hideAlert } = useAlert();

  const route = useRoute<RouteProp<RootStackParamList, any>>();
  cLog(1, { 'Recieved Route': route });
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  let event = initialData.event ? initialData.event : initialData;
  cLog(1, { 'Initial Data': initialData });
  if (route.params) event = route.params?.event.event;
  cLog(1, { 'Event': event });
  const [formData, setFormData] = useState({
    ...event,
    event_date: event.event_date ? new Date(event.event_date) : new Date(),
    event_time: event.event_time
      ? new Date(`1970-01-01T${event.event_time}`)
      : new Date(),
  });
  cLog(1, { 'Form Data': formData });

  const handleSave = async () => {
    const formattedData = {
      ...formData,
      event_date: formData?.event_date?.toISOString().split('T')[0],
      completed: 0,
      event_time: formData?.event_time?.toTimeString().split(' ')[0],
      repeating: Boolean(formData?.repeat_timeline && formData?.repeat_timeline),
      repeat_timeline: formData?.repeat_timeline,
      ingredients:formData?.ingredients,
      money: formData?.money,
    };
    cLog(1, formattedData);
    try {
      const token = await AsyncStorage.getItem('token');
      cLog(1, 'Saving event to:' + updateEndpoint);
      const response = await call(
        `${updateEndpoint}/${token}`,
        method,
        undefined,
        formattedData
      );
      cLog(1, 'Event updated successfully:' + response.data);
      showAlert('Success', 'Event saved successfully!', 'Close', '');
    } catch (error) {
      console.error('Error saving event:', error);
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

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!fetchEndpoint) return;
        cLog(1, 'Fetching additional data...');
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await call(`${fetchEndpoint}/${token}`, 'GET');

          const formattedData = response.data.map(
            (item: { [x: string]: any; id: any; name: any }) => ({
              value: keyValue ? item[keyValue.key] : item.id,
              label: keyValue ? item[keyValue.value] : item.name,
            })
          );

          setTimeout(() => {
            setAdditionalData(formattedData);
          }, 100);
          cLog(1, 'Fetched and formatted data:', formattedData);
        } catch (error) {
          console.error('Error fetching additional data:', error);
        }
      };
      const verifyLoginStatus = async () => {
        const [isLoggedIn, token] = await AsyncStorage.multiGet([
          'isLoggedIn',
          'token',
        ]);
        if (isLoggedIn[1] === 'true' && token[1]) {
          cLog(1, `User is logged in with Token: ${token[1]}`);
        }
      };

      verifyLoginStatus();

      fetchData();
    }, [])
  );
  useEffect(() => {
    cLog(1, 'Updated Additional Data:', additionalData);
  }, [additionalData]);

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await call(`/delete_event/${formData?.id}/${token}`, 'DELETE');
      navigation.navigate(mainPage as any);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            style={styles2.input} 
            value={formData[field.name]}
            onChangeText={(text) => handleChange(field.name, text)}
            placeholder={field.label}
          />
        );
      case 'date':
        return (
          <TouchableOpacity
            style={styles2.dateTimeInput} 
            onPress={() => showPicker('date', field.name)}
          >
            <Text style={styles2.dateTimeText}>
              {formData[field.name] instanceof Date
                ? formData[field.name].toDateString()
                : 'Select Date'}
            </Text>
            {showDatePicker && (
              <DateTimePicker
                value={
                  currentField ? formData[currentField] || new Date() : new Date()
                }
                mode="date"
                display="default"
                onChange={(event, selectedDate) =>
                  handleDateChange(currentField!, selectedDate)
                }
              />
            )}
          </TouchableOpacity>
        );
      case 'multi-select':
        return (
          <View style={styles2.multiSelectContainer}>
            <MultiSelect
              items={additionalData}
              uniqueKey="value"
              selectedItems={
                Array.isArray(formData['ingredients'])
                  ? formData['ingredients']
                  : event.ingredients
                  ? event.ingredients.split(',').map((item: string) =>
                      parseInt(item, 10)
                    )
                  : []
              }
              onSelectedItemsChange={(selectedItems) =>
                handleChange('ingredients', selectedItems)
              }
              selectText="Select Ingredients"
              searchInputPlaceholderText="Search Ingredients..."
              displayKey="label"
              styleDropdownMenuSubsection={styles2.dropdown}
            />
          </View>
        );
      case 'time':
        return (
          <TouchableOpacity
            style={styles2.dateTimeInput} 
            onPress={() => showPicker('time', field.name)}
          >
            <Text style={styles2.dateTimeText}>
              {formData[field.name] instanceof Date
                ? formData[field.name].toLocaleTimeString()
                : 'Select Time'}
            </Text>
            {showTimePicker && (
              <DateTimePicker
                minuteInterval={15}
                value={
                  currentField ? formData[currentField] || new Date() : new Date()
                }
                mode="time"
                display="default"
                onChange={(event, selectedTime) =>
                  handleTimeChange(currentField!, event, selectedTime)
                }
              />
            )}
          </TouchableOpacity>
        );
      case 'dropdown':
        return (
          <Dropdown
            style={styles2.dropdown}
            data={field.options}
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
            style={styles2.textarea}
            value={formData[field.name]}
            onChangeText={(text) => handleChange(field.name, text)}
            multiline
            placeholder={field.label}
          />
        );
      case 'number':
        return (
          <TextInput
            style={styles2.input}
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
    <ScrollView contentContainerStyle={styles2.scrollViewContainer}>
      <View style={styles2.headerContainer}>
        <Text style={styles2.headerText}>{title}</Text>
        {mode === 'view' && (
          <TouchableOpacity
            style={styles2.deleteButton}
            onPress={() =>
              showAlert(
                'Delete Event',
                'Are you sure you want to delete this event?',
                'Cancel',
                'Delete',
                handleDelete
              )
            }
          >
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles2.fieldsContainer}>
        {fields.map((field, index) => (
          <View key={index} style={styles2.fieldContainer}>
            <Text style={styles2.fieldLabel}>{field.label}</Text>
            {renderField(field)}
          </View>
        ))}
      </View>

      <View style={styles2.buttonContainer}>
        <TouchableOpacity
          style={styles2.cancelButton}
          onPress={() => {
            navigation.navigate(mainPage as any);
          }}
        >
          <Text style={styles2.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles2.saveButton} onPress={handleSave}>
          <Text style={styles2.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Alert
        isVisible={alertModal.visible}
        toggleModal={hideAlert}
        header={alertModal.header}
        description={alertModal.message}
        onSave={() => {
          alertModal.onSave();
          hideAlert();
        }}
        saveButtonText={alertModal.saveText}
        closeButtonText={alertModal.closeText}
      />
    </ScrollView>
  );
};

const styles2 = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1, 
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F8F8FF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)', 
    borderRadius: 8,
    padding: 8,
  },
  fieldsContainer: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  dateTimeInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
  multiSelectContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  textarea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#6A0DAD', 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderColor: '#6A0DAD', 
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#6A0DAD',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GenericAddViewPageForm;
