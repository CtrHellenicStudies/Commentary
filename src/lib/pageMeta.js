import $ from 'jquery';

const PageMeta = {
	setBaseDocMeta() {
		PageMeta.setMetaTag('name', 'url', window.location.href);
		PageMeta.setMetaTag('name', 'twitter:card', 'summary');
		PageMeta.setMetaTag('name', 'twitter:url', window.location.href);
		if (process.env.SERVICE_CONFIGURATIONS) {
			PageMeta.setMetaTag('property', 'fb:app_id', process.env.FACEBOOK_APP_ID);
		}
		PageMeta.setMetaTag('property', 'og:url', window.location.href);
		PageMeta.setMetaTag('property', 'og:type', 'website');
		PageMeta.setLinkTag('rel', 'canonical', 'href', window.location.href);
	},

	setTitle(title) {
		document.title = `${title}`;
		PageMeta.setMetaTag('property', 'og:title', title);
		PageMeta.setMetaTag('property', 'og:site_name', title);
		PageMeta.setMetaTag('property', 'og:local', 'en_US');
		PageMeta.setMetaTag('property', 'twitter:title', title);
		PageMeta.setMetaTag('itemprop', 'title', title);
	},

	setDescription(description) {
		PageMeta.setMetaTag('name', 'description', description);
		PageMeta.setMetaTag('property', 'og:description',  description);
		PageMeta.setMetaTag('property', 'twitter:description', description);
		PageMeta.setMetaTag('itemprop', 'description',  description);
	},

	setMetaImage(imageSrc = null) {
		if (imageSrc) {
			PageMeta.setMetaTag('property', 'og:image', imageSrc);
			PageMeta.setMetaTag('property', 'twitter:image', imageSrc);
			PageMeta.setMetaTag('itemprop', 'image', imageSrc);
		} else {
			PageMeta.setMetaTag('property', 'og:image', `${window.location.origin}/images/hector.jpg`);
			PageMeta.setMetaTag('property', 'twitter:image', `${window.location.origin}/images/hector.jpg`);
			PageMeta.setMetaTag('itemprop', 'image', `${window.location.origin}/images/hector.jpg`);
		}
	},

	setMetaTag(attr1, key, val) {
		const meta = document.createElement('meta');
		meta[attr1] = key;
		meta['content'] = val;
		if ($(`meta[${attr1}="${key}"]`).length) {
			$(`meta[${attr1}="${key}"]`).attr('conetnt', val);
		} else {
			document.getElementsByTagName('head')[0].appendChild(meta);
		}
	},

	setLinkTag(attr1, key, attr2, val) {
		const link = document.createElement('link');
		link[attr1] = key;
		link[attr2] = val;
		if ($(`link[${attr1}="${key}"]`).length) {
			$(`link[${attr1}="${key}"]`).attr(attr2, val);
		} else {
			document.getElementsByTagName('head')[0].appendChild(link);
		}
	},
};

export default PageMeta;
