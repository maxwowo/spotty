import e from 'express';
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve();
const JSON_FILE_NAME = 'scraper/golinks.json'

const compareByUsageCount = (a, b) => {
    if (a.usageCount < b.usageCount) {
        return 1
    }
    if (a.usageCount > b.usageCount) {
        return -1
    }
    return 0
}

export const getLinks = (query, results) => {
    const file = fs.readFileSync(path.join(__dirname, JSON_FILE_NAME));
    let data = JSON.parse(file);

    // start of string search
    data = data.filter((o) => {
        if (o.goLink.slice(24).indexOf(query) === 0) {
            return o;
        }
    });

    // fuzzy search
    // data = data.filter(o => o.goLink.slice(24).includes(query));

    data.sort(compareByUsageCount);

    return data.slice(0, results);
}

export const formatGoLinks = (dataList) => {
    dataList.forEach(data => data.goLink = 'go/' + data.goLink.slice(24,))
    return dataList;
}

export const addToHistory = (link, history) => {

    if (!(link in history)) {
        history[link] = 1;
    } else {
        history[link]++;
    }
    console.log(history);
    const stringified = JSON.stringify(history);
    fs.writeFileSync(".golink_history", stringified, { flag: "w" });
}


