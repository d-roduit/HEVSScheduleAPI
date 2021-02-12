const fetch = require('node-fetch');
const jsdom = require("jsdom");

const loadIndexPage = async (req, res, next) => {
    const url = "http://apps.hevs.ch/untis/horaireintra.aspx";

    const fetchResponse = await fetch(url);

    if (!fetchResponse.ok) {
        // TODO: Log error
        return res.status(500).json({ message: `GET request to ${url} failed.`});
    }

    const htmlText = await fetchResponse.text();
    // TODO: Log success

    res.locals.indexPageDocument = new jsdom.JSDOM(htmlText).window.document;

    next();
}

const notAnEndpoint = (req, res) => {
    res.status(404).json({ message: `No endpoint defined for ${req.originalUrl}`});
}

module.exports = { loadIndexPage, notAnEndpoint };
