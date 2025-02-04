const logging = true;
const loggingLevel = 2;

interface LogFunction {
    (logLevel?: number, ...messages: any[]): void;
}

export const cLog: LogFunction = (logLevel = 0, ...messages) => {
    if (logging && logLevel <= loggingLevel) {
        console.log(...messages);
    }
};
