import { useState } from 'react';

interface AlertState {
    visible: boolean;
    header: string;
    message: string;
    closeText: string;
    saveText: string;
    onSave: () => void;
}

export const useAlert = () => {
    const [alertModal, setAlertModal] = useState<AlertState>({
        visible: false,
        header: '',
        message: '',
        closeText: 'Close',
        saveText: '',
        onSave: () => { },
    });

    const showAlert = (
        header: string,
        message: string,
        closeText: string,
        saveText: string,
        onSave: () => void = () => { }
    ) => {
        setAlertModal({
            visible: true,
            header,
            message,
            closeText,
            saveText,
            onSave,
        });
    };

    const hideAlert = () => {
        setAlertModal(prev => ({
            ...prev,
            visible: false,
        }));
    };

    return { alertModal, showAlert, hideAlert };
};