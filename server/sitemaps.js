/**
 * Configure sitemap to be generated for the application
 */

import { sitemaps } from 'meteor/gadicohen:sitemaps';

// models
import Comments from '/imports/models/comments';
import Commenters from '/imports/models/commenters';
import Keywords from '/imports/models/keywords';
import Pages from '/imports/models/pages';
import ReferenceWorks from '/imports/models/referenceWorks';
import Tenants from '/imports/models/tenants';


sitemaps.add('/sitemap.xml', (req) => {
	// required: page
	// optional: lastmod, changefreq, priority, xhtmlLinks, images, videos

	const hostnameArray = req.headers.host.split('.');
	let subdomain;
	let settingsJSON;
	if (process.env.NODE_ENV === 'development') {
		subdomain = Meteor.settings.public.developmentSubdomain;
	} else if (hostnameArray.length > 1 && process.env && process.env.METEOR_SETTINGS) {
		settingsJSON = JSON.parse(process.env.METEOR_SETTINGS);
		subdomain = settingsJSON.public.developmentSubdomain;
	} else {
		subdomain = '';
		window.location.assign('/404');
	}

	const sitemap = [];
	const tenant = Tenants.findOne({ subdomain });
	const tenantId = tenant._id;
	const comments = Comments.find({ tenantId }).fetch();
	const commenters = Commenters.find({ tenantId }).fetch();
	const tagwords = Keywords.find({ tenantId }).fetch();
	const referenceWorks = ReferenceWorks.find({ tenantId }).fetch();
	const pages = Pages.find({ tenantId }).fetch();

	sitemap.push({
		page: '/',
		lastmod: new Date(),
		changefreq: 'monthly'
	});

	sitemap.push({
		page: '/commentary',
	});

	sitemap.push({
		page: '/commenters',
	});

	sitemap.push({
		page: '/tags/words',
	});

	sitemap.push({
		page: '/tags/ideas',
	});

	sitemap.push({
		page: '/referenceWorks',
	});

	pages.forEach((page) => {
		sitemap.push({
			page: `/${page.slug}`,
		});
	});

	tagwords.forEach((tagword) => {
		sitemap.push({
			page: `/tags/${tagword.slug}`,
		});
	});

	referenceWorks.forEach((referenceWork) => {
		sitemap.push({
			page: `/referenceWorks/${referenceWork.slug}`,
		});
	});

	commenters.forEach((commenter) => {
		sitemap.push({
			page: `/commenters/${commenter.slug}`,
		});
	});

	/*
	comments.forEach((comment) => {
		sitemap.push({
			page: `/commentary/?_id=${comment._id}`,
		});
	});
	*/

	return sitemap;
});
