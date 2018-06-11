import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import Cookies from 'js-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import autoBind from 'react-autobind';

// components
import AvatarEditor from '../AvatarEditor/AvatarEditor';
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder/BackgroundImageHolder';
import LoadingPage from '../../../../components/loading/LoadingPage';
import ModalChangePwd from '../../../auth/components/ModalChangePwd';
import Discussions from '../Discussions/Discussions';
import Annotations from '../Annotations/Annotations';
import Account from '../Account/Account';
import Header from '../../../../components/navigation/Header';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';

// lib
import muiTheme from '../../../../lib/muiTheme';
import Utils from '../../../../lib/utils';


import './ProfilePage.css';


// Mui theme for tabs
const tabMuiTheme = {
	palette: {
		primary1Color: 'transparent',
		accent1Color: '#795548',
		textColor: '#444444',
		alternateTextColor: '#444444',
	},
};

class ProfilePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			annotationCheckList: [],
			skip: 0,
			limit: 100,
			usernameError: '',
			emailError: '',
			modalChangePwdLowered: false,
			isPublicEmail: false,
		};

		autoBind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined,
			settings: nextProps.settingsQuery.loading ? {} : nextProps.settingsQuery.settings.find(x => x.tenantId === this.props.tenantId),
			ready: !nextProps.settingsQuery.loading
		});
	}

	static childContextTypes = {
		muiTheme: PropTypes.object.isRequired,
	}


	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	loadMore() {
		this.setState({
			skip: this.state.skip + 10,
		});
	}

	showChangePwdModal() {
		this.setState({
			modalChangePwdLowered: true,
		});
	}

	closeChangePwdModal() {
		this.setState({
			modalChangePwdLowered: false,
		});
	}

	render() {
		const { user, settings } = this.state;

		if (settings) {
			Utils.setTitle(`Profile Page | ${settings.title}`);
			Utils.setDescription('');
			Utils.setMetaImage('');
		}

		if (!user) {
			return <LoadingPage />;
		}

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="page page-user-profile">
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
											<h2 className="page-title ">{user.nicename}</h2>
										</div>
									</div>
								</div>
							</div>
						</section>
						<section className="page-content">
							<div>
								<div className="user-profile-section">
									<AvatarEditor
										defaultAvatarUrl="/images/default_user.jpg"
									/>
								</div>
								<br />
								<div className="user-profile-tabs">
									<MuiThemeProvider muiTheme={getMuiTheme(tabMuiTheme)}>
										<Tabs>
											<Tab label="Discussions">
												<Discussions />
											</Tab>
											<Tab label="Annotations">
												<Annotations />
											</Tab>
											<Tab label="Account">
												<MuiThemeProvider>
													<Account user={user} turnOnPassChange={this.showChangePwdModal} />
												</MuiThemeProvider>
											</Tab>
										</Tabs>
									</MuiThemeProvider>
								</div>
							</div>
						</section>
					</div>
					{this.state.modalChangePwdLowered ?
						<ModalChangePwd
							lowered={this.state.modalChangePwdLowered}
							closeModal={this.closeChangePwdModal}
						/>
						: ''
					}
				</div>
			</MuiThemeProvider>
		);
	}
}

ProfilePage.propTypes = {
	settingsQuery: PropTypes.object
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});


export default compose(
	connect(mapStateToProps),
	settingsQuery,
)(ProfilePage);
