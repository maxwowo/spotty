// const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');

async function delay(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

const func = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });
    const page = await browser.newPage();
    // 	await page.setRequestInterception(true);
    console.log("hi");
    await page.goto('https://go.atlassian.com/content.py?query=&mode=QUERY&show_hash=&first=1&amount=10&col=0&asc=True');
    // await page.goto('https://google.com');
    console.log("went");


    const selector = 'input[name="mfaAnswer"]';
    // const selector = 'input[type="text"]';

    await page.waitForSelector(selector);
    await page.$eval(selector, el => el.value = 'push');

    const buttonSelector = '#mechanismSelectionForm .button-wrapper button[type="submit"';
    await page.$eval(buttonSelector, b => b.classList.remove('disabled'));
    await page.click(buttonSelector);


    // await page.focus(selector);
    // await page.type(selector, 'push');
    // await page.click('button[type="submit"]');
    console.log('typed');

    await page.waitForSelector('table');
    console.log("Arrived!");

}

func();
