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

	try {
		const options = {
			url: fullURL,
			type: httpMethod,
			contentType: "application/pdf",
		}
		
		//Note: NOT const reqResponse = await $.ajax(fullURL, options)
		const reqResponse = $.ajax(fullURL, options)
		await reqResponse

		let blob = new Blob([reqResponse.response], {type: "application/pdf"});
		let link = document.createElement("a");
		link.href = window.URL.createObjectURL(blob);
		link.setAttribute("download", `${fileName}.pdf`);
		link.click();

		responseData.data = `${fileName}.pdf`
		responseData.status = `${reqResponse.status} ${reqResponse.statusText}`

	} catch (error) {
		if (error.readyState === 4) {
			// HTTP error
			if (typeof error.response !== "undefined") {
				//FIXME: req.response contains 404 html page like req.responseText instead of "undefined" like req.responseJSON
				//Error response from server
				responseData.errorType = "httpWithData"
				responseData.error = error.response
			} else {
				responseData.errorType = "http"
			}
			responseData.status = `${error.status} ${error.statusText}`
			responseData.data = `${fileName}.pdf`
		}
		else if (error.readyState === 0) {
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
