// TODO: Pour améliorer les performances, il faudrait que les classes soient stockées dans un fichier
// et updated chaque 30 min OU chaque fois qu'on récupère les classes via la fonction "classes.list()".

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}

const fs = require('fs');

const logsDirectory = './logs';

if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

const currentDate = new Date();
const logFileFilename = `${currentDate.getMonth()+1 < 10 ? `0${currentDate.getMonth()+1}` : currentDate.getMonth()+1}-${currentDate.getFullYear()}-api.log`;

const pino = require('pino');
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
}, `${logsDirectory}/${logFileFilename}`);

const expressPino = require('express-pino-logger')({
    logger: logger
});
const express = require('express');
const classes = require('./actions/classes');
const schedule = require('./actions/schedule');
const site = require('./actions/site');

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

module.exports = api;
