import winston from 'winston';


const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  );

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
        )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/warning.log', level: 'warn' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});

export default logger;



