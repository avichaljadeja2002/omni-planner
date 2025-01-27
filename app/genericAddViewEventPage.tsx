import React, { useCallback, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { cLog } from '../components/log';
import { styles } from '@/assets/styles/styles';
import { GenericEventPageProps, RootStackParamList } from '@/components/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useFocusEffect, RouteProp, useRoute } from '@react-navigation/native';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyToken } from '@/constants/constants';
import { call } from '../components/apiCall';

const GenericAddViewPageForm: React.FC<GenericEventPageProps> = ({ title, initialData = {}, fields, mainPage, updateEndpoint, fetchEndpoint, keyValue, method = "POST" }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [additionalData, setAdditionalData] = useState<any>([]);
    const [currentField, setCurrentField] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const route = useRoute<RouteProp<RootStackParamList, any>>();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    cLog({ "Initial Data": initialData });
    let event = initialData.event ? initialData.event : initialData;
    if (route.params) event = route.params?.event.event;
    cLog({ "Event": event });
    const [formData, setFormData] = useState({
        ...event,
        event_date: event.event_date ? new Date(event.event_date) : new Date(),
        event_time: event.event_time ? new Date(`1970-01-01T${event.event_time}`) : new Date(),
    });

    const handleSave = async () => {
        const isTokenValid = await verifyToken(navigation);
        if (!isTokenValid) return;
        const formattedData = {
            ...formData,
            event_date: formData.event_date?.toISOString().split('T')[0],
            event_time: formData.event_time?.toTimeString().split(' ')[0],
            repeating: Boolean(formData.repeat_timeline && formData.repeat_timeline),
            repeat_timeline: formData.repeat_timeline,
            userId: (await AsyncStorage.getItem('userId')),
            ingredients: formData.ingredients?.join(',')
        };
        cLog(formattedData);
        try {
            cLog('Saving event to:' + updateEndpoint);
            const response = await call(updateEndpoint, method, undefined, formattedData)
            cLog('Event updated successfully:' + response.data);
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

    const fetchAdditionalData = async () => {
        if (!fetchEndpoint) return;
        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await call(`${fetchEndpoint}/${userId}`, 'GET');
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

    const handleChange = (name: string, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const getIngredientNames = (selectedItems: any[]) => {
        const filteredItems = additionalData.filter((item: { value: any }) => selectedItems.includes(item.value));
        return filteredItems.map((item: { label: any }) => item.label);
    };

    useFocusEffect(
        useCallback(() => {
            verifyToken(navigation);
            fetchAdditionalData();
            if (event['repeat_timeline']) {
                event['repeat_timeline'] = parseInt(event['repeat_timeline'], 10);
                event['repeating'] = event['repeat_timeline'] !== 0;
            }

            const parsedIngredients = event.ingredients
                ? event.ingredients.split(',').map((item: string) => parseInt(item, 10))
                : [];

            setFormData({ ...event, ingredients: parsedIngredients });
        }, [event])
    );

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
                            selectedItems={Array.isArray(formData["ingredients"]) ? formData["ingredients"] : getIngredientNames(event.ingredients.split(',').map((item: string) => parseInt(item, 10)))}
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
        <><ScrollView contentContainerStyle={styles.addContainer}>
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
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCancelModal(true)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView><Modal
            animationType="slide"
            transparent={true}
            visible={showCancelModal}
            onRequestClose={() => setShowCancelModal(false)}
        >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Do you want to save your changes before leaving?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonDiscard]}
                                onPress={() => {
                                    setShowCancelModal(false);
                                    navigation.navigate(mainPage as any);
                                }}
                            >
                                <Text style={styles.textStyle}>Discard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => setShowCancelModal(false)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal></>
    );
};

export default GenericAddViewPageForm;