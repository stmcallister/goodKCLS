// get book title from meta tag
// send back to extension with
// chrome.extension.sendRequest();

var metas = document.getElementsByTagName('meta');

// scraping title from goodreads meta tags. sending title to library.
for(var i=0; i < metas.length; i++){
	var tagProp = metas[i].getAttribute('property');
	if(tagProp == "og:title"){
		var title = metas[i].getAttribute('content');
		chrome.runtime.sendMessage({bookTitle: title});
		break;
	}
}
