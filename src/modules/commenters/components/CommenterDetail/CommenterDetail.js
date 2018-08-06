import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import _s from 'underscore.string';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoBind from 'react-autobind';


// graphql
import settingsQuery from '../../../settings/graphql/queries/list';
import commentersQuery from '../../graphql/queries/list';

// components
import Header from '../../../../components/navigation/Header';
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder';
import LoadingPage from '../../../../components/loading/LoadingPage';
import CommenterReferenceWorks from '../CommenterReferenceWorks/CommenterReferenceWorks';
import CommenterVisualizations from '../CommenterVisualizations/CommenterVisualizations';
import CommentsRecent from '../../../comments/components/CommentsRecent';

// lib
import muiTheme from '../../../../lib/muiTheme';
import Utils from '../../../../lib/utils';
import PageMeta from '../../../../lib/pageMeta';


import './CommenterDetail.css';



class CommenterDetail extends React.Component {
	constructor(props) {
		super(props);

		const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined;
		this.state = {
			readMoreBio: false,
			loggedIn: user,
			subscriptions: user && user.subscriptions
		};
		autoBind(this);
	}

	toggleReadMoreBio() {
		const { readMoreBio } = this.state;

		this.setState({
			readMoreBio: !readMoreBio,
		});
	}

	getBiographyHTML(biography) {
		if (Utils.isJson(biography)) {
			return JSON.parse(biography).html;
		}
		return biography;
	}

	componentWillReceiveProps(props) {
		const { tenantId } = this.props;
		const slug = props.match.params.slug;

		let avatarUrl;
		const commenter = props.commentersQuery.loading ? {} :
			props.commentersQuery.commenters.find(x => x.slug === slug && x.tenantId === tenantId);

		if (commenter && commenter.avatar) {
			avatarUrl = commenter.avatar.src;
		}
		this.setState({
			avatarUrl: avatarUrl,
			commenter: commenter,
			settings: props.settingsQuery.loading ? {} : props.settingsQuery.settings
		});
	}

	render() {
		const { readMoreBio, commenter, settings, avatarUrl } = this.state;

		if (commenter) {
			PageMeta.setTitle(`${commenter.name} | ${settings.title}`);
			PageMeta.setDescription(_s.truncate(commenter.bio, 120));
			PageMeta.setMetaImage(avatarUrl);
		}

		return (
			(commenter ?
				<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
					<div className="page page-commenter-detail">
						<Header />
						<div className="content primary">
							<section className="block header cover parallax">
								<BackgroundImageHolder
									imgSrc="/images/capitals.jpg"
								/>
								<div className="container v-align-transform">
									<div className="grid inner">
										<div className="center-content">
											<div className="page-title-wrap">
												<h2 className="page-title ">
													{commenter.name}
												</h2>
											</div>
										</div>
									</div>
								</div>
							</section>
							<section className="page-content">

								<div className="commenter-image">
									<img src={avatarUrl} alt={commenter.name} />
								</div>

								<div className={`user-bio ${(readMoreBio ? 'user-bio--read-more' : '')}`}>

									{commenter.bio ?
										<div dangerouslySetInnerHTML={{ __html: this.getBiographyHTML(commenter.bio) }} />
										:
										<p>There is no biography information for this user yet.</p>
									}


								</div>
								<div
									className={`read-more-toggle
									${(readMoreBio ? 'read-more-toggle-expanded' : '')}`}
								>
									<hr />
									{ commenter.bio && commenter.bio.length > 500 ?

										<div
											className="read-more-button"
											onClick={this.toggleReadMoreBio}
										>
											{readMoreBio ?
												<span className="read-less-text">
													Show Less
												</span>
												:
												<span className="read-more-text">
													Read More
												</span>
											}
										</div>
										:
										null
									}
								</div>

								<CommenterVisualizations
									commenter={commenter}
								/>

								<br />
								<br />
								<br />
								<hr />
							</section>

							<CommenterReferenceWorks
								commenter={commenter}
							/>

							<CommentsRecent />
						</div>
					</div>
				</MuiThemeProvider>
				:
				<LoadingPage />
			)
		);
	}
}

CommenterDetail.propTypes = {
	avatarUrl: PropTypes.string,
	settings: PropTypes.shape({
		title: PropTypes.string.isRequired,
	}),
	match: PropTypes.object,
	commentersQuery: PropTypes.object,
	settingsQuery: PropTypes.object
};

CommenterDetail.defaultProps = {
	commenter: null,
	avatarUrl: null,
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	commentersQuery,
	settingsQuery,
)(CommenterDetail);
