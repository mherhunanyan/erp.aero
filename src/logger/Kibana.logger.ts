import chalk from 'chalk';

class KibanaLogger {
    private context: string | undefined;

    constructor(context?: string) {
        this.context = context;
    }

    log(message: string) {
        console.log(chalk.white(this.format('INFO', message)));
    }

    info(message: string) {
        console.log(chalk.blueBright(this.format('INFO', message)));
    }

    debug(message: string) {
        console.log(chalk.cyan(this.format('DEBUG', message)));
    }

    warn(message: string) {
        console.log(chalk.yellow(this.format('WARN', message)));
    }

    error(message: string, trace?: string) {
        console.log(chalk.red(this.format('ERROR', message + ' - ' + trace)));
    }

    private format(level: string, message: string) {
        return JSON.stringify({
            timestamp: new Date().toLocaleString(),
            context: this.context,
            level,
            message,
        });
    }
}

export default KibanaLogger;
