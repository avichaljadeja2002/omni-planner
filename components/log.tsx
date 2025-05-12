const logging = false;
const loggingLevel = 3;

interface LogFunction {
    (logLevel?: number, ...messages: any[]): void;
}

export const cLog: LogFunction = (logLevel = 0, ...messages) => {
    if (logging && logLevel <= loggingLevel) {
        console.log(...messages);
    }
};
