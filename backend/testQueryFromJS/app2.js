const axios = require('axios');

const func = (async () => {
    const response = await axios.get('https://go.atlassian.com/content.py?query=work&mode=QUERY&first=0&amount=10')
        .catch(function(error) {
            // handle error
            console.log(error);
        })
    console.log(response);
    const text = await response.text();
    const dom = await new JSDOM(text);
    console.log(dom.window.document.querySelector("h1").textContent);
})()
