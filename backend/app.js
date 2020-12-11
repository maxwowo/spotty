import express, { json } from 'express';
import cors from 'cors'
import { addToHistory, formatGoLinks, getLinks } from './helpers.js';
import fs from 'fs';

const app = express();
const db = [];
app.use(cors());

var history = {};
if (fs.existsSync(".golink_history")) {
    history = JSON.parse(fs.readFileSync(".golink_history"));
} else {
    history = {};
}

app.listen(5000, () => {
    console.log('Example app listening on port 5000!');

});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

/*
* GET Function
* Consumes a search
* Returns a list of queries that match the search term
*/
app.get('/api/get_link/:search/:results?', (req, res) => {
    let search = req.params.search;
    var results = req.params.results;
    if (results === undefined) {
        results = 10;
    }
    let links = getLinks(search, results);
    links = formatGoLinks(links);
    if (links.length === 0) {
        // console.log('fail')
        return res.status(404).send({
            success: 'false',
            message: 'url does not exist',
        });
    } else {
        // console.log('success')
        return res.status(200).send({
            success: 'true',
            message: 'returns url',
            links
        });
    }

});

export default app;