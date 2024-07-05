/* eslint-disable no-console */
class ConsoleLogger {
    private context: string | undefined;

    constructor(context?: string) {
        this.context = context;
    }

    log(message: string) {
        console.log(this.format('LOG', message));
    }

    info(message: string) {
        console.info(this.format('INFO', message));
    }

    debug(message: string) {
        console.debug(this.format('DEBUG', message));
    }

    warn(message: string) {
        console.warn(this.format('WARN', message));
    }

    error(message: string) {
        console.error(this.format('ERROR', message));
    }

    private format(level: string, message: string) {
        return `[${level}] - ${new Date().toISOString()} [${this.context}]: ${message}`;
    }
}

export default ConsoleLogger;
