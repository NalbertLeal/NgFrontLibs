/*
*	@brief	Discover the name of the browser that is running this code.
*	@return The name of the browser that is running this code.
*/
function browserName() {
	if(document.documentMode || /Edge/.test(navigator.userAgent)) {
		return "edge"
	}
	else if(!!window.chrome && !!window.chrome.webstore) {
		return "chrome"
	}
	else if(typeof InstallTrigger !== 'undefined') {
		return "firefox"
	}
	else if((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
		return "opera"
	}
	else {
		return "other";
	}
}

/*
*	@brief	Exame tho discover if an specific HTML tag if been visualized be the user now. 
*	@param 	el 	the html element to exame and return if the user screen visualize this element now.
*	@return 	Return true is the screen of the user is on the element tag passed by parameter, return false in any other case.
*/
function isInViewport(el){
    var rect = el.getBoundingClientRect();
    
    return (
        rect.bottom >= 0 && 
        rect.right >= 0 && 
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) && 
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
     );
}

/*
*	@brief	Register an javascript function to an event on the page.
*	@param 	event 	The name of the event.
*	@param 	func 	The function name (function pointer).
*/
function registerListener(event, func) {
    if (window.addEventListener) {
        window.addEventListener(event, func)
    } else {
        window.attachEvent('on' + event, func)
    }
}

/*
*	@brief	Pull from the server each small versions of images.
*/
function pullSmallImg() {
	[].forEach.call(document.querySelectorAll('img[lazy-small-src]'), function(img) {
		img.setAttribute('src', img.getAttribute('lazy-small-src'));
		img.onload = function() {
			img.removeAttribute('lazy-small-src');
		};
	});
}

/*
*	@brief	If the user move the scroll this function is called to exame if the user see an image i=with the lazy-normal-src parameter.
*/
function screenOnImg() {
	[].forEach.call(document.querySelectorAll('img[lazy-normal-src]'), function(img) {
		if(isInViewport(img)) {
			pullNormalImg(img);
		}
	});
}

/*
*	@brief	Pull the normal image from the server. If the global variable "imgBrowserSupport" is true then this function pull the image by the type of the browser.
*	@param 	img 	The tag of the image to pull from the server.	
*/
function pullNormalImg(img) {
	// if the global variable "imgBrowserSupport" is true run the code bellow
	if(imgBrowserSupport) {
		let name = browserName();
		// if the browser that run this code is opera or chrome then the image format is .webp
		if(name == "opera" || name == "chrome") {
			img.setAttribute('src', img.getAttribute('lazy-normal-src') + ".webp");
		} 
		// if the browser that run this code is edge then the image format is .jpeg-xr
		else if(name == "edge") {
			img.setAttribute('src', img.getAttribute('lazy-normal-src') + ".jpeg-xr");
		} 
		// if the browser that run this code is safari then the image format is .jpeg-2000
		else if(name == "safari") {
			img.setAttribute('src', img.getAttribute('lazy-normal-src') + ".jpeg-2000");
		} 
		// if the browser that run this code is unknown then the image format is .jpg
		else {
			img.setAttribute('src', img.getAttribute('lazy-normal-src') + ".jpg");
		}
		img.onload = function() {
			img.removeAttribute('lazy-normal-src');
		};
	}
	// Run the code bellow as default
	else {
		img.setAttribute('src', img.getAttribute('lazy-normal-src'));
		img.onload = function() {
			img.removeAttribute('lazy-normal-src');
		};
	}
}

pullSmallImg();
registerListener('load', screenOnImg);
registerListener('scroll', screenOnImg);