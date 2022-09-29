let urls = [
	"https://url/123",
	"https://url/456",
	"https://url/789"
];

function downloadAll(urls) {
	let link = document.createElement("a");

	link.setAttribute("download", null);
	link.style.display = "none";

	document.body.appendChild(link);

	for (let i = 0; i < urls.length; i++) {
		link.setAttribute("href", urls[i]);
		link.click();
	}

	document.body.removeChild(link);
}

downloadAll(urls)
