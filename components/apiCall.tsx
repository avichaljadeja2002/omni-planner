import { IPAddr } from '@/constants/constants';
import axios, { AxiosResponse } from 'axios';
import { cLog } from './log';

export const call = async (endpoint: string, method: string, headers?: string, data?: any): Promise<AxiosResponse<any>> => {
    const fullUrl = `${IPAddr}${endpoint}`;
    cLog(1, 'API Call URL:', fullUrl);

    try {
        const response = await axios({
            url: fullUrl,
            method: method,
            data: data,
            headers: headers ? { 'Content-Type': headers } : {},
        });
        return response;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

export const full_call = async (endpoint: string, method: string, headers?: string, data?: any): Promise<AxiosResponse<any>> => {
    cLog(1, 'API Call URL:', endpoint);

    try {
        const response = await axios({
            url: endpoint,
            method: method,
            data: data,
            headers: headers ? { 'Content-Type': headers } : {},
        });
        return response;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

