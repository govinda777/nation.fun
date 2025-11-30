type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private level: LogLevel;

  constructor() {
    this.level = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };

    if (process.env.NODE_ENV === 'production') {
      // Em produção, enviar para serviço de logging (Sentry, Datadog, etc)
      console.log(JSON.stringify(logEntry));
    } else {
      // Em dev, log formatado
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta || '');
    }
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (this.level === 'debug') this.log('debug', message, meta);
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.log('error', message, meta);
  }
}

export const logger = new Logger();
