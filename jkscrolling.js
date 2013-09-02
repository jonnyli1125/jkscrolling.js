var jkscrolling = {
	author: "Jonny Li",
	url: "http://jonny.li",
	version: "1.0.0",
	license: "http://creativecommons.org/licenses/by-sa/3.0/",
	alignHeight: 0,
	posts: [],
	current: null,
	initialize: function() {
		this.alignHeight = this.getVerticalPos(this.getAlign());
		this.posts = this.getAllPosts();
		this.calibrate();
	},
	keypress: function(e) {
		if (this.posts.length <= 1) return;
		this.alignHeight = this.getVerticalPos(this.getAlign());
		var speed = 100;
		switch (e.keyCode) {
			case 106: // j
				this.goDown(speed);
				break;
			case 107: // k
				this.goUp(speed);
				break;
		}
	},
	calibrate: function() {
		this.alignHeight = this.getVerticalPos(this.getAlign());
		var fromTop = this.getScrollTop() + this.alignHeight;
		this.posts = this.getAllPosts();
		if (this.posts.length <= 0) return;
		var last = 0;
		for (var i = 0; i < this.posts.length; i++) {
			var post = this.posts[i];
			if (post.offsetTop <= fromTop && post.offsetTop > last) {
				last = post.offsetTop;
				this.current = post;
			}
		}
	},
	goDown: function(speed) {
		var newPost = typeof(this.current) === "undefined" || this.current == null ? this.posts[0] : this.current.nextElementSibling;
		if (newPost != null) {
			if (newPost.className == "tumblrAutoPager_page_info") newPost = newPost.nextElementSibling; // compatibility with endless scrolling
			if (newPost.dataset.jks == "post") this.scrollTo(document.body, newPost.offsetTop - this.alignHeight, speed);
		}
	},
	goUp: function(speed) {
		if (typeof(this.current) === "undefined") return;
		var newPost = Math.round(this.getVerticalPos(this.current)) < this.alignHeight ? this.current : this.current.previousElementSibling;
		if (newPost != null) {
			if (newPost.className == "tumblrAutoPager_page_info") newPost = newPost.previousElementSibling; // compatibility with endless scrolling
			if (newPost.dataset.jks == "post") this.scrollTo(document.body, newPost.offsetTop - this.alignHeight, speed);
		}
	},
	scrollTo: function(element, to, duration) {
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
window.onkeypress = function(e) { jkscrolling.keypress(e); };
window.onscroll = function() { jkscrolling.calibrate(); };
window.onload = function() { jkscrolling.initialize(); };