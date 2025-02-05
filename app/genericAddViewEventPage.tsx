import React, { useCallback, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { cLog } from '../components/log';
import { styles } from '@/assets/styles/styles';
import { GenericEventPageProps, RootStackParamList } from '@/components/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useFocusEffect, RouteProp, useRoute } from '@react-navigation/native';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { call } from '../components/apiCall';
import { FontAwesome } from '@expo/vector-icons';
import Alert from './alert';

const GenericAddViewPageForm: React.FC<GenericEventPageProps> = ({ title, initialData = {}, fields, mainPage, updateEndpoint, fetchEndpoint, keyValue, method = "POST", mode }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [additionalData, setAdditionalData] = useState<any>([]);
    const [currentField, setCurrentField] = useState<string | null>(null);

    const [alertModal, setAlertModal] = useState({
        visible: false,
        header: '',
        message: '',
        closeText: 'Close',
        saveText: '',
        onSave: () => { },
    });

    const showAlert = (header: string, message: string, closeText: string, saveText: string, onSave: () => void = () => { }) => {
        setAlertModal({ visible: true, header, message, closeText, saveText, onSave });
    };

    const route = useRoute<RouteProp<RootStackParamList, any>>();
    cLog(1, { "Recieved Route": route });
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    let event = initialData.event ? initialData.event : initialData;
    cLog(1, { "Initial Data": initialData });
    if (route.params) event = route.params?.event.event;
    cLog(1, { "Event": event });
    const [formData, setFormData] = useState({
        ...event,
        event_date: event.event_date ? new Date(event.event_date) : new Date(),
        event_time: event.event_time ? new Date(`1970-01-01T${event.event_time}`) : new Date(),
    });
    cLog(1, { "Form Data": formData });

    const handleSave = async () => {
        const formattedData = {
            ...formData,
            event_date: formData.event_date?.toISOString().split('T')[0],
            event_time: formData.event_time?.toTimeString().split(' ')[0],
            repeating: Boolean(formData.repeat_timeline && formData.repeat_timeline),
            repeat_timeline: formData.repeat_timeline,
            ingredients: formData.ingredients?.join(','),
            money: formData.money
        };
        cLog(1, formattedData);
        try {
            const token = await AsyncStorage.getItem('token');
            cLog(1, 'Saving event to:' + updateEndpoint);
            const response = await call(`${updateEndpoint}/${token}`, method, undefined, formattedData)
            cLog(1, 'Event updated successfully:' + response.data);
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

                    const formattedData = response.data.map((item: { [x: string]: any; id: any; name: any }) => ({
                        value: keyValue ? item[keyValue.key] : item.id,
                        label: keyValue ? item[keyValue.value] : item.name,
                    }));

                    setTimeout(() => {
                        setAdditionalData(formattedData);
                    }, 100);
                    cLog(1, 'Fetched and formatted data:', formattedData);
                } catch (error) {
                    console.error('Error fetching additional data:', error);
                }
            };
            const verifyLoginStatus = async () => {
                const [isLoggedIn, token] = await AsyncStorage.multiGet(['isLoggedIn', 'token']);
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
            await call(`/delete_event/${formData.id}/${token}`, 'DELETE');
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
                            <Text style={{ textAlign: 'left' }}>{formData[field.name] instanceof Date
                                ? formData[field.name].toDateString()
                                : 'Select Date'}</Text>
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
                    <View>
                        <MultiSelect
                            items={additionalData}
                            uniqueKey="value"
                            selectedItems={Array.isArray(formData["ingredients"]) ? formData["ingredients"] : event.ingredients ? event.ingredients.split(',').map((item: string) => parseInt(item, 10)) : []}
                            onSelectedItemsChange={(selectedItems) => handleChange('ingredients', selectedItems)}
                            selectText="Select Ingredients"
                            searchInputPlaceholderText="Search Ingredients..."
                            displayKey="label"
                            styleDropdownMenuSubsection={styles.dropdown}
                        />
                    </View>
                );
            case 'time':
                return (
                    <View style={styles.dateTimeInLine}>
                        <TouchableOpacity onPress={() => showPicker('time', field.name)}>
                            <Text style={{ textAlign: 'left' }}>{formData[field.name] instanceof Date
                                ? formData[field.name].toLocaleTimeString()
                                : 'Select Time'}</Text>
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
        <>    <ScrollView contentContainerStyle={styles.addContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.addViewSectionHeader}>{title}</Text>
                {mode === "view" && (
                    <TouchableOpacity style={styles.trashButton} onPress={() => showAlert('Delete Event', 'Are you sure you want to delete this event?', 'Cancel', 'Delete', handleDelete)}>
                        <FontAwesome name="trash" size={24} color="red" />
                    </TouchableOpacity>
                )}
            </View>

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
                <TouchableOpacity style={styles.cancelButton} onPress={() => { navigation.navigate(mainPage as any); }}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
            <Alert
                isVisible={alertModal.visible}
                toggleModal={() => setAlertModal({ ...alertModal, visible: false })}
                header={alertModal.header}
                description={alertModal.message}
                onSave={() => alertModal.onSave()}
                saveButtonText={alertModal.saveText}
                closeButtonText={alertModal.closeText}
            />
        </>
    );
};

export default GenericAddViewPageForm;