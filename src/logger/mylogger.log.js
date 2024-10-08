'use strict'

const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const { v4: uuidv4 } = require('uuid')

class MyLogger {
    constructor() {
        const formatPrint = format.printf(
            ({level, message, context, requestId, timestamp, metadata}) => {
                return `${timestamp} :: ${level} :: ${context} :: ${requestId} :: ${JSON.stringify(message)} :: ${metadata} `
            }
        )

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                   dirname: 'logs',
                   filename: 'application-%DATE%.info.log',
                   datePattern: 'YYYY-MM-DD-HH-mm',     // 20, 21 YYYY-MM-DD-HH-mm
                   zippedArchive: true,                 // true: backup log zipped archive
                   maxSize: '1m',                       // dung luong file log
                   maxFiles: '14d',                     // thoi gian ton tai file log
                   format: format.combine(
                    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                    formatPrint
                   ),
                   level: 'info'
                }),
                new transports.DailyRotateFile({
                    dirname: 'logs',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',     // 20, 21 YYYY-MM-DD-HH-mm
                    zippedArchive: true,                 // true: backup log zipped archive
                    maxSize: '1m',                       // dung luong file log
                    maxFiles: '14d',                     // thoi gian ton tai file log
                    format: format.combine(
                     format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                     formatPrint
                    ),
                    level: 'error'
                 })
            ]
        })
    }

    commonParams(params) {
        let context,        // info router
            req,            // info header
            metadata;       // metadata
        
        if (!Array.isArray(params)) {
            context = params
        } else {
            [context, req, metadata] = params;
        }

        // requestId: đại diện cho tiến trình process của 1 User tương tác với hệ thống. 
        const requestId = req?.requestId || uuidv4()

        return { requestId, context, metadata }
    }

    log(message, params) {
        const paramLog = this.commonParams(params)
        const logObject = Object.assign({message}, paramLog)

        this.logger.info(logObject)
    }

    error(message, params) {
        const paramLog = this.commonParams(params)

        const logObject = Object.assign({message}, paramLog)

        this.logger.error(JSON.stringify(logObject))
    }
}

module.exports = new MyLogger()