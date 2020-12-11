// This is the working script!!!

// const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');
const fs = require('fs');

let pageNum = 0;
const numResultsPerSearch = 1500;
const startDate = new Date();

const writeHtml = (htmlString) => {
	return new Promise((resolve) => {
		fs.writeFile('htmlDumps/' + pageNum + '.html', htmlString, function (err) {
			if (err) throw err;
			console.log('Saved!');
			console.log('');
			resolve();
		});
	});
}

const scrapePage = async (page, url) => {
	await page.goto(url);

	// await page.waitForSelector('table');

	try {

		const noSearchResultsFound = await page.$eval('#msg span', (element) => {
			return element.innerHTML
		});

		if (noSearchResultsFound.includes('No search results found')) {
			console.log("FINISHED!");
			return false;
		}
	}
	catch (e) {
		// skip if not found
	}

	const htmlString = await page.$eval('body', (element) => {
		return element.innerHTML
	});

	await writeHtml(htmlString);
	return true;
}

const func = async () => {
	const browser = await puppeteer.launch({
		headless: true,
		executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		userDataDir: "./user_data",
	});

	const page = await browser.newPage();

	while (true) {
		console.log(`Scraping page ${pageNum}`);
		const timeMillis = new Date().getTime() - startDate.getTime();

		console.log(`Time elapsed: ${Math.floor(timeMillis / 1000)}s`);
		const first = pageNum * numResultsPerSearch + 1;
		const path = `https://go.atlassian.com/content.py?query=&mode=QUERY&show_hash=&first=${first}&amount=${numResultsPerSearch}&col=0&asc=True`;

		if (await scrapePage(page, path) == false) {
			break;
		}
		pageNum++;
	}

	console.log("Exiting");
}

func();

