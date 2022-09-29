let urls = [
	"https://url/123",
	"https://url/456",
	"https://url/789"
];

async function downloadAll(urls) {
	const taskList = []

	for (let i = 0; i < urls.length; i++) {
		taskList.push(WRequestAsync(urls[i], "GET"))
	}

	await Promise.all(taskList)
}

async function WRequestAsync(fullURL, httpMethod) {

	$.ajax({
		url: fullURL,
		type: httpMethod,
		contentType: "application/pdf",
		success: function (data) {
			let blob = new Blob([data], {type: "application/pdf"});
			let link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.setAttribute("download","download");
			link.click();
		}
	});
}

downloadAll(urls)
