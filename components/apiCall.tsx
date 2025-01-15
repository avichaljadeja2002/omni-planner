import { IPAddr } from '@/constants/constants';
import axios, { AxiosResponse } from 'axios';
import { cLog } from './log';

export const call = async (endpoint: string, method: string, headers?: string, data?: any): Promise<AxiosResponse<any>> => {
    const fullUrl = `${IPAddr}${endpoint}`;
    cLog('Full URL:', fullUrl);

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
