var jkscrolling = {
	author: "Jonny Li",
	url: "http://jonny.li",
	version: "1.0.0",
	license: "http://creativecommons.org/licenses/by-sa/3.0/",
	alignHeight: 0,
	posts: [],
	current: null,
	animating: false,
	scrollSpeed: 125,
	tolerance: 1,
	ie: false,
	initialize: function() {
		this.posts = this.getAllPosts();
		this.calibrate(this.tolerance);
		this.ie = navigator.appName == "Microsoft Internet Explorer";
	},
	keydown: function(e) {
		if (this.posts.length <= 0) return;
		var tag = e.target.tagName.toLowerCase();
		switch (e.keyCode) {
			case 74: // j
				if (tag != "input" && tag != "textarea") this.goDown(this.scrollSpeed);
				break;
			case 75: // k
				if (tag != "input" && tag != "textarea") this.goUp(this.scrollSpeed);
				break;
		}
	},
	calibrate: function(tolerance) {
		if (typeof(tolerance) == "undefined") tolerance = 1; // scrolling not always perfect, default 1 pixel tolerance
		this.alignHeight = this.getAlign() != null ? this.getVerticalPos(this.getAlign()) : 0;
		var fromTop = this.getScrollTop() + this.alignHeight + tolerance;
		this.posts = this.getAllPosts();
		if (this.posts.length <= 0) return;
		var last = 0;
		for (var i = 0; i < this.posts.length; i++) {
			var post = this.posts[i];
			if (post.offsetTop <= fromTop && post.offsetTop >= last) {
				last = post.offsetTop;
				this.current = post;
			}
		}
	},
	goDown: function(speed) {
		if (this.animating) return;
		var newPost = typeof(this.current) === "undefined" || this.current == null ? this.posts[0] : this.current.nextElementSibling;
		if (newPost != null) {
			if (newPost.className == "tumblrAutoPager_page_info") newPost = newPost.nextElementSibling; // compatibility with endless scrolling
			if (newPost.getAttribute("data-jks") == "post") this.scrollTo(this.ie ? document.querySelector("html") : document.body, newPost.offsetTop - this.alignHeight, speed);
			// i wanted to use element.dataset but internet explorer happened, so :(
		}
	},
	goUp: function(speed) {
		if (this.animating || typeof(this.current) === "undefined" || Array.prototype.indexOf.call(this.posts, this.current) <= 0) return;
		var newPost = Math.round(this.getVerticalPos(this.current)) < this.alignHeight ? this.current : this.current.previousElementSibling;
		if (newPost != null) {
			if (newPost.className == "tumblrAutoPager_page_info") newPost = newPost.previousElementSibling; // compatibility with endless scrolling
			if (newPost.getAttribute("data-jks") == "post") this.scrollTo(this.ie ? document.querySelector("html") : document.body, newPost.offsetTop - this.alignHeight, speed);
		}
	},
	scrollTo: function(element, to, duration) {
		if (duration <= 0) return;
		var start = element.scrollTop,
		change = to - start,
		currentTime = 0,
		increment = 20;
		this.animating = true;
		var complete = function() { jkscrolling.animating = false; element.scrollTop = to; };
		if (typeof(jQuery) === "undefined") {
			var animateScroll = function() {
				currentTime += increment;
				var val = Math.easeInOutQuad(currentTime, start, change, duration);
				element.scrollTop = val;
				if (currentTime < duration) setTimeout(animateScroll, increment);
				else complete();
			};
			animateScroll();
		} else $(element).animate({ scrollTop: to }, duration, "swing", complete);
	},
	getScrollTop: function() {
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
	},
	getVerticalPos: function(node) { // get vertical position from window top
		return node.getBoundingClientRect().top;
	},
	getAlign: function() { return document.querySelector("[data-jks=\"align\"]"); },
	getAllPosts: function() { return document.querySelectorAll("[data-jks=\"post\"]"); }
};
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
window.onkeydown = function(e) { jkscrolling.keydown(e); };
window.onscroll = function() { jkscrolling.calibrate(jkscrolling.tolerance); };
window.onload = function() { jkscrolling.initialize(); };
