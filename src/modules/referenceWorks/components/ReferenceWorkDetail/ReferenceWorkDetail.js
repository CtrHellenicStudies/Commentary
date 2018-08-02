import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// components
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder';
import CommentsRecent from '../../../comments/components/CommentsRecent';
import Header from '../../../../components/navigation/Header';

// lib
import muiTheme from '../../../../lib/muiTheme';


const createMarkup = (referenceWork) => {
	let __html = '';
	__html += '<p>';
	if (referenceWork.desc) {
		__html += referenceWork.desc.replace('\n', '</p><p>');
	} else {
		__html += 'No description is available for this work.';
	}
	__html += '</p>';

	return {
		__html,
	};
}

const ReferenceWorkDetail = ({ referenceWork, settings, commenters }) => (
	<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
		<div className="page reference-works-page reference-works-detail-page">
			<Header />
			<div className="content primary">
				<section className="block header header-page cover parallax">
					<BackgroundImageHolder
						imgSrc="/images/apotheosis_homer.jpg"
					/>

					<div className="container v-align-transform">
						<div className="grid inner">
							<div className="center-content">
								<div className="page-title-wrap">
									<h2 className="page-title ">{referenceWork.title}</h2>
									{referenceWork.link ?
										<a
											className="read-online-link"
											href={referenceWork.link}
											target="_blank"
											rel="noopener noreferrer"
										>
											Read Online <i className="mdi mdi-open-in-new" />
										</a>
										: ''}
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="page-content">

					{commenters && commenters.length ?
						<div className="page-byline">
							<h3>By {commenters.map((commenter, i) => {
								let ending = '';

								if (i < commenters.length - 2) {
									ending = ', ';
								} else if (i < commenters.length - 1) {
									ending = ' and ';
								}

								return (
									<span
										key={i}
									>
										<a
											href={`/commenters/${commenter.slug}`}
										>
											{commenter.name}
										</a>{ending}
									</span>
								);
							})}
							</h3>
						</div>
						: ''}

					<div
						dangerouslySetInnerHTML={createMarkup(referenceWork)}
					/>
				</section>

				<CommentsRecent />
			</div>
		</div>
	</MuiThemeProvider>
);

ReferenceWorkDetail.propTypes = {
	referenceWorks: PropTypes.object,
	settings: PropTypes.object,
};

export default ReferenceWorkDetail;
