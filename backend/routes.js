import { app } from './app.js';

app.get('/api/get_link/:search', (req, res) => {
    let search = req.params.search;
    console.log(search)
    let links = getLinks(search);
    if (links.length === 0) {
        return res.status(404).send({
            success: 'false',
            message: 'does not exist',
        });
    } else {
        return res.status(200).send({
            success: 'true',
            message: 'hello bitch',
            links
        });
    }
});