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

	await Promise.all(taskList)
}

async function WRequestAsync(fullURL, httpMethod, fileName) {

	let req = new XMLHttpRequest();

	req.responseType = "blob";
	req.open(httpMethod, fullURL, true);

	req.send();


	req.onload = function (event) {
		let blob = req.response;
		let link = document.createElement("a");
		link.href = window.URL.createObjectURL(blob);
		link.setAttribute("download", `${fileName}.pdf`);
		link.click();
	};
}

downloadAll(urls, fileNames)
