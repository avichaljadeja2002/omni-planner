import { logging } from '@/constants/constants';

interface LogFunction {
    (...messages: any[]): void;
}

export const cLog: LogFunction = (...messages) => {
    if (logging) {
        console.log(...messages);
    }
};
