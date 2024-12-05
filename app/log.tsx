import { logging } from './constants';

interface LogFunction {
    (message: string): void;
}

export const cLog: LogFunction = (message) => {
    if (logging) {
        console.log(message);
    }
};