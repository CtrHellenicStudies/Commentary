import { sitemaps } from 'meteor/gadicohen:sitemaps';

// api
import Comments from '/imports/api/collections/comments';
import Commenters from '/imports/api/collections/commenters';
import Keywords from '/imports/api/collections/keywords';
import Pages from '/imports/api/collections/pages';
import ReferenceWorks from '/imports/api/collections/referenceWorks';
import Tenants from '/imports/api/collections/tenants';


sitemaps.add('/sitemap.xml', (req) => {
	// required: page
	// optional: lastmod, changefreq, priority, xhtmlLinks, images, videos

	const hostnameArray = req.headers.host.split('.');
	let subdomain;

	if (process.env.NODE_ENV === 'development') {
		subdomain = Meteor.settings.public.developmentSubdomain;
	} else if (hostnameArray.length > 1) {
		subdomain = hostnameArray[0];
	} else {
		subdomain = '';
		FlowRouter.go('/404');
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
