import { cLog } from '@/components/log';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface AlertProps {
    isVisible: boolean;
    toggleModal: () => void;
    header: string;
    description: string;
    onSave: () => void;
    saveButtonText: string;
    closeButtonText?: string;
}

const Alert: React.FC<AlertProps> = ({ isVisible, toggleModal, header, description, onSave, saveButtonText, closeButtonText="Cancel"}) => {
    const handleSave = () => {
        onSave();
        toggleModal();
    }
    cLog(1, "Alert Props:", { isVisible, header, description, saveButtonText, closeButtonText });
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalHeader}>{header}</Text>
                    <Text style={styles.modalMessage}>{description}</Text>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={toggleModal}
                    >
                        <Text style={styles.textStyle}>{closeButtonText}</Text>
                    </TouchableOpacity>
                    {saveButtonText && (
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <Text style={styles.textStyle}>{saveButtonText}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        minWidth: 100,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    accountSetting: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'column',
        gap: 20,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left',

    },
    textInput: {
        height: 45,
        borderColor: '#ccc',
        width: '70%',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#65558f',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#ff6347',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 40,
        marginTop: 10,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },

});

export default Alert;