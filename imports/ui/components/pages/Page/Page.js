import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { compose } from 'react-apollo';

// lib
import Utils from '/imports/lib/utils';

// graphql
import { settingsQuery } from '/imports/graphql/methods/settings';
import { pagesQuery } from '/imports/graphql/methods/pages';

// layouts
import NotFound from '/imports/ui/layouts/notFound/NotFound';
import muiTheme from '/imports/lib/muiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '/imports/ui/layouts/header/Header';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';


class Page extends Component {

	constructor(props) {
		super(props);
		this.state = {
			tenantId: sessionStorage.getItem('tenantId')
		};
	}
	componentWillReceiveProps(props) {
		const { slug } = props;
		let thumbnails = [];
	
		const page = props.pagesQuery.loading ? {} : props.pagesQuery.find(x => x.slug === slug);
		if (page) {
			if (page.headerImage && Array.isArray(page.headerImage)) {
				thumbnails = Thumbnails.find({ originalId: { $in: page.headerImage } }).fetch();
			}
		}
		this.setState({
			page,
			ready: !props.settingsQuery.loading && !props.pagesQuery.loading,
			thumbnails,
			settings: props.settingsQuery.loading ? { title: '' } : props.settingsQuery.settings.find(x => x.tenantId === tenantId)
		});
	}
	render() {
		const { page, settings, slug, ready } = this.props;
		let content;
		if (page)			{ content = Utils.getHtmlFromContext(Utils.getEditorState(page.content).getCurrentContent()); }
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
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className={`page page-${slug} content primary page-custom`}>
					<Header />
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
			</MuiThemeProvider>
		);
	}
}
Page.propTypes = {
	slug: PropTypes.string,
	pagesQuery: PropTypes.object,
	settingsQuery: PropTypes.object
};
export default compose(
	settingsQuery,
	pagesQuery
)(Page);
