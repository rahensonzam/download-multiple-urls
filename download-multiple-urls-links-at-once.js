let urls = [
	"https://url/123",
	"https://url/456",
	"https://url/789"
];

async function downloadAll(urls) {
	const taskList = []

	for (let i = 0; i < urls.length; i++) {
		taskList.push(downloadOne(urls[i]))
	}

	const resultList = await Promise.all(taskList)
	console.log(resultList)

}

async function downloadOne(url) {
	let link = document.createElement("a");

	link.setAttribute("download", null);
	link.style.display = "none";

	document.body.appendChild(link);

	link.setAttribute("href", url);
	link.click();

	document.body.removeChild(link);
	return 2
}

downloadAll(urls)
