import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

// lib
import Utils from '/imports/lib/utils';

// models
import Pages from '/imports/models/pages';
import Settings from '/imports/models/settings';

// layouts
import NotFound from '/imports/ui/layouts/notFound/NotFound';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';


class Page extends React.Component {

	render() {
		const { page, settings, slug, ready } = this.props;
		let content;
		if(page)
			content = Utils.getHtmlFromContext(Utils.getEditorState(page.content).getCurrentContent());
		const headerImageUrl = '/images/apotheosis_homer.jpg';

		if (!ready) {
			return (
				<LoadingPage />
			);
		} else if (ready && !page) {
			return (
				<NotFound
					isTest={slug === '__test__'}
				/>
			);
		}

		if (page && page.title) {
			Utils.setTitle(`${page.title} | ${settings.title}`);
		}
		if (headerImageUrl) {
			Utils.setMetaImage(headerImageUrl);
		}

		return (
			// todo: return 404 if !page.length
			<div className={`page page-${slug} content primary`}>

				<section className="block header header-page cover parallax">
					<BackgroundImageHolder
						imgSrc="/images/apotheosis_homer.jpg"
					/>

					<div className="container v-align-transform">
						<div className="grid inner">
							<div className="center-content">
								<div className="page-title-wrap">
									<h1 className="page-title">
										{page.title}
									</h1>
									<h2>
										{page.subtitle}
									</h2>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="page-content container">
					{page.byline ?
						<div className="page-byline">
							<h3>
								{page.byline}
							</h3>
						</div>
						: ''}
					<div dangerouslySetInnerHTML={{ __html: content }} />
				</section>
			</div>
		);
	}
}

Page.propTypes = {
	slug: PropTypes.string,
	page: PropTypes.object,
	ready: PropTypes.bool,
	images: PropTypes.array,
	thumbnails: PropTypes.array,
	settings: PropTypes.object,
};


const pageContainer = createContainer(({ slug }) => {
	let images = [];
	let thumbnails = [];

	const tenantId = Session.get('tenantId');
	const pageHandle = Meteor.subscribe('pages', tenantId, slug);
	const settingsHandle = Meteor.subscribe('settings.tenant', tenantId);

	const page = Pages.findOne({ slug, tenantId });

	const imageHandle = Meteor.subscribe('pageImages', tenantId, slug);
	if (page) {
		if (page.headerImage && Array.isArray(page.headerImage)) {
			images = Images.find({ _id: { $in: page.headerImage } }).fetch();
			thumbnails = Thumbnails.find({ originalId: { $in: page.headerImage } }).fetch();
		}
	}

	return {
		page,
		ready: pageHandle.ready(),
		images,
		thumbnails,
		settings: settingsHandle.ready() ? Settings.findOne() : { title: '' }
	};
}, Page);

export default pageContainer;
