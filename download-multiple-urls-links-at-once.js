let urls = [
	"https://url/123.pdf",
	"https://url/456",
	"https://url/789.pdf"
];

let fileNames = [
	"123.pdf",
	"456.pdf",
	"789.pdf"
];

async function downloadAll(urls, fileNames) {
	const taskList = []

	for (let i = 0; i < urls.length; i++) {
		taskList.push(WRequestAsync(urls[i], "GET", fileNames[i]))
	}

	const resultList = await Promise.all(taskList)

	for (let i = 0; i < resultList.length; i++) {
		console.log(`${resultList[i].data} ${resultList[i].status} ${resultList[i].errorType}`, resultList[i].error)
	}
}

async function WRequestAsync(fullURL, httpMethod, fileName) {

	return new Promise(function (resolve, reject) {
		let req = new XMLHttpRequest();

		req.responseType = "blob";
		req.open(httpMethod, fullURL, true);

		req.send();


		req.onload = function (event) {
			if (req.status >= 200 && req.status < 300) {
				const responseData = {}
				let blob = new Blob([req.response], {type: "application/pdf"});
				let link = document.createElement("a");
				link.href = window.URL.createObjectURL(blob);
				link.setAttribute("download", `${fileName}`);
				link.click();
				
				responseData.data = `${fileName}`
				responseData.status = `${req.status} ${req.statusText}`
				resolve(responseData);
			} else {
				const responseData = {}
				// HTTP error
				if (typeof req.response !== "undefined") {
					//FIXME: req.response contains 404 html page like req.responseText instead of "undefined" like req.responseJSON
					//Error response from server
					responseData.errorType = "httpWithData"
					responseData.error = req.response
				} else {
					responseData.errorType = "http"
				}
				responseData.status = `${req.status} ${req.statusText}`
				responseData.data = `${fileName}`
				resolve(responseData);
			}
		};

		req.onerror = function (event) {
			if (req.readyState === 0) {
				const responseData = {}
				// Network error (i.e. timeout, connection refused, access denied due to CORS, etc.)
				responseData.errorType = "network"
				responseData.error = "Network error"
				responseData.status = "request failed"
				responseData.data = `${fileName}`
				resolve(responseData);
			} else {
				const responseData = {}
				// something weird is happening
				responseData.errorType = "unknown"
				responseData.error = "Unknown error with web request"
				responseData.status = "request failed"
				responseData.data = `${fileName}`
				resolve(responseData);
			}
		}
	})
}

downloadAll(urls, fileNames)
