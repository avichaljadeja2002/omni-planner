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

const Alert: React.FC<AlertProps> = ({ isVisible, toggleModal, header, description, onSave, saveButtonText, closeButtonText = "Cancel" }) => {
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
                    <View style={styles.modalButtons}>
                        {closeButtonText && (
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={toggleModal}
                            >
                                <Text style={styles.textStyle}>{closeButtonText}</Text>
                            </TouchableOpacity>
                        )}
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
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
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
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    button: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 40,
        marginHorizontal: 5,
        elevation: 2,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    saveButton: {
        backgroundColor: '#65558f',
    },
});

export default Alert;
