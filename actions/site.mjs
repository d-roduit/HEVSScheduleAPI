import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { readFile } from 'node:fs/promises';

const config = JSON.parse(await readFile(new URL('../config.json', import.meta.url)));

const loadIndexPage = async (req, res, next) => {
    const hevsSiteURL = config.hevsSiteURL;

    const fetchResponse = await fetch(hevsSiteURL);

    if (!fetchResponse.ok) {
        // TODO: Log error
        return res.status(500).json({ message: `GET request to ${hevsSiteURL} failed.`});
    }

    const htmlText = await fetchResponse.text();
    // TODO: Log success

    res.locals.indexPageDocument = new JSDOM(htmlText).window.document;

    next();
}

const notAnEndpoint = (req, res) => {
    res.status(404).json({ message: `No endpoint defined for ${req.originalUrl}`});
}

export default { loadIndexPage, notAnEndpoint };
