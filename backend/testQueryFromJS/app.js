const axios = require('axios');

console.log('test');
let startTime = new Date().getTime();
console.log("Start time: ", new Date().getTime());

axios.get('https://go.atlassian.com/content.py?query=work&mode=QUERY&first=0&amount=100')
	.then(function (response) {
		// handle success
		console.log(response);
		console.log("End time: ", new Date().getTime());
		console.log("Time spent: ", new Date().getTime() - startTime);
	})
	.catch(function (error) {
		// handle error
		console.log(error);
	})
	.then(function () {
		console.log("Done");
		// always executed
		//
		//
		startTime = new Date().getTime();
		axios.get('https://go.atlassian.com/content.py?query=work&mode=QUERY&first=0&amount=100')
			.then(function (response) {
				// handle success
				console.log(response);
				console.log("End time: ", new Date().getTime());
				console.log("Time spent 2: ", new Date().getTime() - startTime);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				console.log("Done");
				// always executed
			});
	});
