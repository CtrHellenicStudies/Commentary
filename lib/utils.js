this.Utils = {
	isReady: function(sub) {
		if(sub) {
			return FlowRouter.subsReady(sub);
		} else {
			return FlowRouter.subsReady();
		}
	},
	prettyDate: function(date) {
		if (date) {
			if (Config.dateFormat) {
				return moment(date).format(Config.dateFormat);
			} else {
				return moment(date).format('D/M/YYYY');
			}
		}
	},
	timeSince: function(date) {
		var interval, seconds;
		if (date) {
			seconds = Math.floor((new Date() - date) / 1000);
			interval = Math.floor(seconds / 31536000);
			if (interval > 1) {
				return interval + "years ago";
			}
			interval = Math.floor(seconds / 2592000);
			if (interval > 1) {
				return interval + " months ago";
			}
			interval = Math.floor(seconds / 86400);
			if (interval > 1) {
				return interval + " days ago";
			}
			interval = Math.floor(seconds / 3600);
			if (interval > 1) {
				return interval + " hours ago";
			}
			interval = Math.floor(seconds / 60);
			if (interval > 1) {
				return interval + " minutes";
			}
			return "just now";
		}
	},
	trunc: (str, length) => {
		const ending = '...';
		let trimLen = length;

		if (trimLen == null) {
			trimLen = 100;
		}

		if (str.length > length) {
			return str.substring(0, length - ending.length) + ending;
		}

		return str;
	},

	isMobile: function() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	},
	loginRequired: function() {
		return Router.go('/sign-in');
	},
	scrollToTop: function() {
		return $("html,body").animate({
			scrollTop: $('body').offset().top
		}, 500);
	},
	scrollToElem: function() {
		return $("html,body").animate({
			scrollTop: $(selector).offset().top
		}, 500);
	},
	initHeadroom: function() {
		var headroom;
		headroom = new Headroom(document.getElementById("header"));
		return headroom.init();
	},
	capitalize: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
};
