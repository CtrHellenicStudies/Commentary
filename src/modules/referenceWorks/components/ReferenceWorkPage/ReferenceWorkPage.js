import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// components
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder';
import CommentsRecent from '../../../comments/components/CommentsRecent';
import LoadingPage from '../../../../components/loading/LoadingPage';
import Header from '../../../../components/navigation/Header';
import ReferenceWorkList from '../ReferenceWorkList';

// lib
import PageMeta from '../../../../lib/pageMeta';
import muiTheme from '../../../../lib/muiTheme';


const ReferenceWorkPage = ({ settings }) => {

	if (!settings) {
		return <LoadingPage />;
	}

	PageMeta.setTitle(`Reference Works | ${settings.title}`);
	PageMeta.setDescription(`Reference Works for ${settings.title}`);
	PageMeta.setMetaImage(`${window.location.origin}/images/achilles_2.jpg`);

	return (
		<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
			<div className="page reference-works-page">
				<Header />
				<div className="content primary">
					<section className="block header header-page	cover parallax">
						<BackgroundImageHolder
							imgSrc="/images/achilles_2.jpg"
						/>

						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h2 className="page-title ">Reference Works</h2>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content">
						<ReferenceWorkList />
					</section>

					<CommentsRecent />
				</div>
			</div>
		</MuiThemeProvider>
	);
};

ReferenceWorkPage.propTypes = {
	settings: PropTypes.object,
};

ReferenceWorkPage.defaultProps = {
	settings: {
		title: '',
	},
};

export default ReferenceWorkPage;
