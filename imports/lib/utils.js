import { DocHead } from 'meteor/kadira:dochead';

// lib
import Config from './_config/_config.js';


const Utils = {
	isReady: (sub) => {
		if (sub) {
			return FlowRouter.subsReady(sub);
		}
		return FlowRouter.subsReady();
	},
	prettyDate: (date) => {
		if (Config.dateFormat) {
			return moment(date).format(Config.dateFormat);
		}
		return moment(date).format('D/M/YYYY');
	},
	timeSince: (date) => {
		let interval;
		const seconds = Math.floor((new Date() - date) / 1000);
		interval = Math.floor(seconds / 31536000);
		if (interval > 1) {
			return `${interval} years ago`;
		}
		interval = Math.floor(seconds / 2592000);
		if (interval > 1) {
			return `${interval} months ago`;
		}
		interval = Math.floor(seconds / 86400);
		if (interval > 1) {
			return `${interval} days ago`;
		}
		interval = Math.floor(seconds / 3600);
		if (interval > 1) {
			return `${interval} hours ago`;
		}
		interval = Math.floor(seconds / 60);
		if (interval > 1) {
			return `${interval} minutes ago`;
		}
		return 'just now';
	},
	trunc: (str, length) => {
		const ending = ' ...';
		let trimLen = length;
		str = str.replace(/<(?:.|\n)*?>/gm, '');

		if (trimLen == null) {
			trimLen = 100;
		}

		if (str.length > length) {
			return str.substring(0, length - ending.length) + ending;
		}

		return str;
	},

	isMobile: () => {
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	},
	loginRequired: () => {
		Router.go('/sign-in');
	},
	scrollToTop: () => {
		$('html,body').animate({
			scrollTop: $('body').offset().top,
		}, 500);
	},
	scrollToElem: () => {
		$('html,body').animate({
			scrollTop: $(selector).offset().top,
		}, 500);
	},
	initHeadroom: () => {
		const headroom = new Headroom(document.getElementById('header'));
		if (headroom) {
			return headroom.init();
		}
		return false;
	},
	capitalize: (str) => {
		const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
		return capitalized;
	},
	sortRevisions: (a, b) => {
		if (a.updated && b.updated) {
			if (a.updated < b.updated) {
				return -1;
			} else if (a.updated > b.updated) {
				return 1;
			}
			return 0;
		}
		return 0;
	},
	defaultCmp: function defaultCmp(a, b) {
		if (a === b) return 0;
		return a < b ? -1 : 1;
	},
	getCmpFunc: (primer, reverse) => {
		const dfc = Utils.defaultCmp;
		let cmp = Utils.defaultCmp;
		if (primer) {
			cmp = (a, b) => { // eslint-disable-line
				return dfc(primer(a), primer(b));
			};
		}
		if (reverse) {
			return (a, b) => { // eslint-disable-line
				return -1 * cmp(a, b);
			};
		}
		return cmp;
	},
	sortBy: function sort() {
		const fields = [];
		const nFields = arguments.length;
		let field;
		let name;
		let cmp;

		// preprocess sorting options
		for (let i = 0; i < nFields; i++) {
			field = arguments[i]; // eslint-disable-line

			if (typeof field === 'string') {
				name = field;
				cmp = Utils.defaultCmp;
			} else {
				name = field.name;
				cmp = Utils.getCmpFunc(field.primer, field.reverse);
			}
			fields.push({
				name,
				cmp,
			});
		}

		// final comparison function
		return (A, B) => {
			let result;

			for (let i = 0; i < nFields; i++) {
				result = 0;
				field = fields[i];
				name = field.name;

				result = field.cmp(A[name], B[name]);
				if (result !== 0) break;
			}
			return result;
		};
	},
	setBaseDocMeta() {
		Utils.setMetaTag('name', 'url', 'content', location.href);
		Utils.setMetaTag('name', 'twitter:card', 'content', 'summary');
		Utils.setMetaTag('name', 'twitter:url', 'content', location.href);
		if ('serviceConfigurations' in Meteor.settings && 'facebook' in Meteor.settings.serviceConfigurations) {
			Utils.setMetaTag('property', 'fb:app_id', 'content', Meteor.settings.serviceConfigurations.facebook.appId);
		}
		Utils.setMetaTag('property', 'og:url', 'content', location.href);
		Utils.setMetaTag('property', 'og:type', 'content', 'website');
		Utils.setLinkTag('rel', 'canonical', 'href', location.href);
	},
	setTitle(title) {
		DocHead.setTitle(`${title}`);
		Utils.setMetaTag('property', 'og:title', 'content', title);
		Utils.setMetaTag('property', 'og:site_name', 'content', title);
		Utils.setMetaTag('property', 'og:local', 'content', 'en_US');
		Utils.setMetaTag('property', 'twitter:title', 'content', title);
		Utils.setMetaTag('itemprop', 'title', 'content', title);
	},
	setDescription(description) {
		Utils.setMetaTag('name', 'description', 'content', description);
		Utils.setMetaTag('property', 'og:description', 'content', description);
		Utils.setMetaTag('property', 'twitter:description', 'content', description);
		Utils.setMetaTag('itemprop', 'description', 'content', description);
	},
	setMetaImage(imageSrc = null) {
		if (imageSrc) {
			Utils.setMetaTag('property', 'og:image', 'content', imageSrc);
			Utils.setMetaTag('property', 'twitter:image', 'content', imageSrc);
			Utils.setMetaTag('itemprop', 'image', 'content', imageSrc);
		} else {
			Utils.setMetaTag('property', 'og:image', 'content', `${location.origin}/images/hector.jpg`);
			Utils.setMetaTag('property', 'twitter:image', 'content', `${location.origin}/images/hector.jpg`);
			Utils.setMetaTag('itemprop', 'image', 'content', `${location.origin}/images/hector.jpg`);
		}
	},
	setMetaTag(attr1, key, attr2, val) {
		const metaInfo = {};
		metaInfo[attr1] = key;
		metaInfo[attr2] = val;
		if ($(`meta[${attr1}="${key}"]`).length) {
			$(`meta[${attr1}="${key}"]`).attr(attr2, val);
		} else {
			DocHead.addMeta(metaInfo);
		}
	},
	setLinkTag(attr1, key, attr2, val) {
		const linkInfo = {};
		linkInfo[attr1] = key;
		linkInfo[attr2] = val;
		if ($(`link[${attr1}="${key}"]`).length) {
			$(`link[${attr1}="${key}"]`).attr(attr2, val);
		} else {
			DocHead.addLink(linkInfo);
		}
	},
	replaceLast(str, find, replace) {
		const index = str.lastIndexOf(find);
		if (index >= 0) {
			return str.substring(0, index) + replace + str.substring(index + find.length);
		}
		return str.toString();
	},
	getEntityData(entity, key) {
		const foundItem = entity.data.mention._root.entries.find(item => (item[0] === key));
		return foundItem[1];
	},
	setCookieDomain() {
		let domain;

		if (location.hostname.match(/\w+.chs.harvard.edu/)) {
			domain = 'chs.harvard.edu';
		} else if (location.hostname.match(/\w+.orphe.us/)) {
			domain = 'orphe.us';
		} else if (location.hostname.match(/\w+.localhost.dev/)) {
			domain = 'localhost.dev';
		}

		return domain;
	},
};

export default Utils;
