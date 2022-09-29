let urls = [
	"https://url/123",
	"https://url/456",
	"https://url/789"
];

let fileNames = [
	"123",
	"456",
	"789"
];

async function downloadAll(urls, fileNames) {
	const taskList = []

	for (let i = 0; i < urls.length; i++) {
		taskList.push(WRequestAsync(urls[i], "GET", fileNames[i]))
	}

	const resultList = await Promise.all(taskList)

	for (let i = 0; i < resultList.length; i++) {
		console.log(`${resultList[i].data} ${resultList[i].status} ${resultList[i].errorType} ${resultList[i].error}`)
	}
}

async function WRequestAsync(fullURL, httpMethod, fileName) {

	const responseData = {}

	let req = new XMLHttpRequest();

	req.responseType = "blob";
	req.open(httpMethod, fullURL, true);

	req.send();


	req.onload = function (event) {
		if (req.status === 200) {
			let blob = req.response;
			let link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.setAttribute("download", `${fileName}.pdf`);
			link.click();
			
			responseData.data = `${fileName}.pdf`
			responseData.status = `${req.status} ${req.statusText}`
		} else {
			// HTTP error
			if (typeof req.response !== "undefined") {
				//FIXME: req.response contains 404 html page like req.responseText instead of "undefined" like req.responseJSON
				//Error response from server
				responseData.errorType = "httpWithData"
				responseData.error = req.response
			} else {
				responseData.errorType = "http"
			}
			responseData.status = `${error.status} ${error.statusText}`
			responseData.data = `${fileName}.pdf`
		}
	};

	req.onerror = function (event) {
		if (req.readyState === 0) {
			// Network error (i.e. timeout, connection refused, access denied due to CORS, etc.)
			responseData.errorType = "network"
			responseData.error = "Network error"
			responseData.status = "request failed"
			responseData.data = `${fileName}.pdf`
		}
		else {
			// something weird is happening
			responseData.errorType = "unknown"
			responseData.error = "Unknown error with web request"
			responseData.status = "request failed"
			responseData.data = `${fileName}.pdf`
		}
	}

	return responseData
}

downloadAll(urls, fileNames)
