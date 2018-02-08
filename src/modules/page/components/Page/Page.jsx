import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// lib
import Utils from '../../../../lib/utils';

// graphql
import { settingsQuery } from '../../../../graphql/methods/settings';
import pagesQuery from '../../graphql/queries/pagesQuery';

// layouts
import NotFound from '../../../notFound/components/NotFound/NotFound';
import muiTheme from '../../../../lib/muiTheme';
import Header from '../../../../components/navigation/Header';

// components
import BackgroundImageHolder from '../../../shared/BackgroundImageHolder';
import LoadingPage from '../../../../components/loading/LoadingPage';


class Page extends Component {

	constructor(props) {
		super(props);
		this.state = {
			tenantId: sessionStorage.getItem('tenantId')
		};
	}
	componentWillReceiveProps(props) {
		const { slug } = props;
	
		const page = props.pagesQuery.loading ? {} : props.pagesQuery.pages.find(x => x.slug === slug);
		this.setState({
			page,
			ready: !props.settingsQuery.loading && !props.pagesQuery.loading,
			settings: props.settingsQuery.loading ? { title: '' } : props.settingsQuery.settings.find(x => x.tenantId === this.state.tenantId)
		});
	}
	render() {
		const { slug } = this.props;
		const { page, settings, ready } = this.state;
		let content;
		if (page) { 
			if(Utils.isJson(page.content)) {
				content = Utils.getHtmlFromContext(Utils.getEditorState(page.content).getCurrentContent());
			} else {
				content = page.content;
			}
		}
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
