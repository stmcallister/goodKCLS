// gotback.js -- background file for extension 
var libUrl = "http://catalog.kcls.org/eg/opac/results?qtype=title&query=";
var currentTab = '';
var bookTitle = '';

function getBookTitle(metaTitle){
	var prettyTitle = '';
	var titleEnd = metaTitle.search(/\(/);
	
	if(titleEnd > 0){
		prettyTitle = metaTitle.substr(0, titleEnd);
	}else{
		prettyTitle = metaTitle
	}
	
	// escape spaces for '+' to be compatible with kcls search
	prettyTitle = prettyTitle.replace(/\s/g, "+");
	
	return prettyTitle;
}

function searchLibrary(bookTitle, tab){
	// build bookTitle and urlTail
	bookTitle += "&page=0&x=0&y=0&fi%3Amattype=&loc=1";
	// build library url search string
	libUrl += bookTitle;
	// search for the book
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			chrome.pageAction.show(tab.id);
		}
	}
	xhr.open("GET", libUrl, true);
	xhr.send(null);
	bookTitle = '';
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	// get title from goodreads meta tag
	bookTitle = getBookTitle(request.bookTitle);
	searchLibrary(bookTitle, currentTab);
			
	// open a new tab and call the library search page
	chrome.tabs.create({"url":libUrl,"selected":true});
	
	// required to close request
	sendResponse({});
});

chrome.pageAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(null, {file: "goodcontentscript.js"});
});

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
	if(change.status == "loading"){
		currentTab = tab;
		libUrl = "http://catalog.kcls.org/eg/opac/results?qtype=title&query=";
		
		if(currentTab.url.match(/\b(http\:\/\/www\.goodreads\.com\/book\/show\/)/i)){
			chrome.pageAction.show(tab.id);
		} else {
			chrome.pageAction.hide(tab.id);
		}
	};
});

// analytics code to track extension usage
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-29102263-1']);
	_gaq.push(['_trackPageview']);

	(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();