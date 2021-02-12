// TODO: Pour améliorer les performances, il faudrait que les classes soient stockées dans un fichier
// et updated chaque 30 min OU chaque fois qu'on récupère les classes via la fonction "classes.list()".

// TODO: Mettre l'url du site qu'on fetch en variable d'environnement, pour que ce soit simple à changer si besoin.

const express = require('express');
const classes = require('./actions/classes');
const schedule = require('./actions/schedule');
const site = require('./actions/site');

const api = express();
const port = 3000;

api.listen(port, () => {
    console.log(`HEVS Schedule API listening at http://localhost:${port}`);
});

api.use('/', (req, res, next) => {
    // TODO: Log
    // console.log(`${req.originalUrl} requested at : ${Date.now()}`);
    next();
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
