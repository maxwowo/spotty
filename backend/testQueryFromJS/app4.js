'use strict';

const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch();
	let page = await browser.newPage();

	// Enable Request Interception
	await page.setRequestInterception(true);

	// Client cert files
	const cert = fs.readFileSync('/path/to/cert.crt.pem');
	const key = fs.readFileSync('/path/to/cert.key.pem');

	page.on('request', interceptedRequest => {
		// Intercept Request, pull out request options, add in client cert
		const options = {
			uri: interceptedRequest.url(),
			method: interceptedRequest.method(),
			headers: interceptedRequest.headers(),
			body: interceptedRequest.postData(),
			cert: cert,
			key: key
		};

		// Fire off the request manually (example is using using 'request' lib)
		request(options, function (err, resp, body) {
			// Abort interceptedRequest on error
			if (err) {
				console.error(`Unable to call ${options.uri}`, err);
				return interceptedRequest.abort('connectionrefused');
			}

			// Return retrieved response to interceptedRequest
			interceptedRequest.respond({
				status: resp.statusCode,
				contentType: resp.headers['content-type'],
				headers: resp.headers,
				body: body
			});
		});

	});

	await page.goto('https://client.badssl.com/');
	await browser.close();
})();
