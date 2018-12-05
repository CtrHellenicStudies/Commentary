import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// lib
import PageMeta from '../../../../lib/pageMeta';
import Utils from '../../../../lib/utils';
import muiTheme from '../../../../lib/muiTheme';

// components
import Header from '../../../../components/navigation/Header';
import Footer from '../../../../components/navigation/Footer';
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder';


import './Page.css';


const Page = ({ title, slug, subtitle, byline, content, headerImageUrl, settings }) => {
	let _content;
	if(Utils.isJson(content)) {
		_content = Utils.getHtmlFromContext(Utils.getEditorState(content).getCurrentContent());
	} else {
		_content = content;
	}

	PageMeta.setTitle(`${title} | ${settings.title}`);
	PageMeta.setMetaImage(headerImageUrl);

	return (
		<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
			<div>
				<Header />
				<div className={`page page-${slug} content primary page-custom`}>
					<section className="block header header-page cover parallax">
						<BackgroundImageHolder
							imgSrc="/images/apotheosis_homer.jpg"
						/>

						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h1 className="page-title">
											{title}
										</h1>
										{subtitle &&
											<h2 className="page-subtitle">
												{subtitle}
											</h2>
										}
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content container">
						{byline &&
							<div className="page-byline">
								<h3>
									{byline}
								</h3>
							</div>
						}
						<div dangerouslySetInnerHTML={{ __html: _content }} />
					</section>
				</div>
				<Footer />
			</div>
		</MuiThemeProvider>
	);
}

Page.propTypes = {
	title: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	settings: PropTypes.object.isRequired,
	subtitle: PropTypes.string,
	byline: PropTypes.string,
	headerImageUrl: PropTypes.string,
};

Page.defaultProps = {
	headerImageUrl: '/images/apotheosis_homer.jpg',
	byline: null,
	subtitle: null,
};


export default Page;
