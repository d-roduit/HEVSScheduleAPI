// TODO: Pour améliorer les performances, il faudrait que les classes soient stockées dans un fichier
// et updated chaque 30 min OU chaque fois qu'on récupère les classes via la fonction "classes.list()".

import 'dotenv/config'
import fs from 'node:fs';
import pino from 'pino';
import pinoMultiStream from 'pino-multi-stream';
import expressPinoLogger from 'express-pino-logger';
import express from 'express';
import classes from './actions/classes.mjs';
import schedule from './actions/schedule.mjs';
import site from './actions/site.mjs';

const logsDirectory = './logs';

if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

const currentDate = new Date();
const logFileFilename = `${currentDate.getMonth()+1 < 10 ? `0${currentDate.getMonth()+1}` : currentDate.getMonth()+1}-${currentDate.getFullYear()}-api.log`;
const loggerStreams = [
    // { stream: process.stdout }, // Uncomment it to enable logging in console
    { stream: fs.createWriteStream(`${logsDirectory}/${logFileFilename}`, { flags: 'a' }) },
];

const logger = pino({
    name: 'apiLogger',
    formatters: {
        level (label, number) {
            return { level: label }
        }
    },
    timestamp: () => {
        const options = {
            hourCycle: 'h24',
            weekday: "short",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };

        return `,"time":"${new Date(Date.now()).toLocaleDateString('en', options)}"`;
    }
}, pinoMultiStream.multistream(loggerStreams));

const expressPino = expressPinoLogger({ logger: logger });

const api = express();
const port = process.env.PORT;

api.use(expressPino);

api.listen(port, () => {
    console.log(`HEVS Schedule API listening on port ${port}`);
    logger.info(`HEVS Schedule API listening on port ${port}`);
});

/**
 * Routes
 */

// Classes

api.get('/classes', site.loadIndexPage, classes.list);

// Schedule

api.get('/schedule/:class', site.loadIndexPage, schedule.get);
api.get('/schedule/:class/:date', site.loadIndexPage, schedule.get);

// Any other undefined route

api.get('/*', site.notAnEndpoint);

export default api;
