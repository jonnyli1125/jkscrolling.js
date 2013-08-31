var alignHeight = getVerticalPos(getAlign());
var posts = getAllPosts();
var current = posts[0];
window.onkeypress = function(e) {
	if (posts.length <= 1) return;
	if (typeof(current) === "undefined") return;
	alignHeight = getVerticalPos(getAlign());
	var speed = 100;
	switch (e.keyCode) {
		case 106: // j
			scrollDown(speed);
			break;
		case 107: // k
			scrollUp(speed);
			break;
	}
};
function scrollDown(speed) {
	var newPost = current.nextElementSibling;
	if (newPost.className == "tumblrAutoPager_page_info") newPost = newPost.nextElementSibling; // compatibility with endless scrolling
	if (newPost != null && newPost.dataset.jks == "post") scrollTo(document.body, newPost.offsetTop - alignHeight, speed);
}
function scrollUp(speed) {
	var newPost = current.previousElementSibling;
	if (newPost.className == "tumblrAutoPager_page_info") newPost = newPost.previousElementSibling; // compatibility with endless scrolling
	if (newPost != null && newPost.dataset.jks == "post") scrollTo(document.body, newPost.offsetTop - alignHeight, speed);
}
window.onscroll = function() {
	alignHeight = getVerticalPos(getAlign());
	var fromTop = getScrollTop() + alignHeight;
	posts = getAllPosts();
	if (posts.length <= 0) return;
	var last = 0;
	for (var i = 0; i < posts.length; i++) {
		var post = posts[i];
		if (post.offsetTop <= fromTop && post.offsetTop > last) {
			last = post.offsetTop;
			current = post;
		}
	}
};
function scrollTo(element, to, duration) {
	if (duration <= 0) return;
	var start = element.scrollTop,
	change = to - start,
	currentTime = 0,
	increment = 20;
	var animateScroll = function() {
		currentTime += increment;
		var val = Math.easeInOutQuad(currentTime, start, change, duration);
		element.scrollTop = val;
		if(currentTime < duration) { setTimeout(animateScroll, increment); }
	};
	animateScroll();
}
//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

function getScrollTop() {
	if (typeof pageYOffset != 'undefined') {
		//most browsers except IE before #9
		return pageYOffset;
	}
	else {
		var B = document.body; //IE 'quirks'
		var D = document.documentElement; //IE with doctype
		D = (D.clientHeight) ? D: B;
		return D.scrollTop;
	}
}
function getVerticalPos(node) { // get vertical position from window top
	return node.getBoundingClientRect().top;
}
function getAlign() { return document.querySelector("[data-jks=\"align\"]"); }
function getAllPosts() { return document.querySelectorAll("[data-jks=\"post\"]"); }