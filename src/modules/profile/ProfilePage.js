import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import Cookies from 'js-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { compose } from 'react-apollo';

// components
import AvatarEditor from './avatar/AvatarEditor';
import BackgroundImageHolder from '../shared/BackgroundImageHolder';
import LoadingPage from '../../components/loading/LoadingPage';
import ModalChangePwd from '../login/ModalChangePwd';
import Discussions from './Discussions';
import Annotations from './Annotations';
import Account from './Account';
import Header from '/imports/ui/layouts/header/Header';

// graphql
import { settingsQuery } from '../../graphql/methods/settings';

// lib
import muiTheme from '../../lib/muiTheme';
import Utils from '../../lib/utils';

// Mui theme for tabs
const tabMuiTheme = {
	palette: {
		primary1Color: 'transparent',
		accent1Color: '#795548',
		textColor: '#444444',
		alternateTextColor: '#444444',
	},
};

class ProfilePage extends React.Component {
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
			tenantId: sessionStorage.getItem('tenantId')
		};

		this.getChildContext = this.getChildContext.bind(this);
		this.loadMore = this.loadMore.bind(this);
		this.showChangePwdModal = this.showChangePwdModal.bind(this);
		this.closeChangePwdModal = this.closeChangePwdModal.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			user: Cookies.getItem('user'),
			settings: nextProps.settingsQuery.loading ? {} : nextProps.settingsQuery.settings.find(x => x.tenantId === this.state.tenantId),
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

		const toggleStyle = {
			style: {
				margin: '20px 0 0 0',
			},
		};

		const changePwdStyle = {
			margin: '11px 0 0 0',
		};

		if (settings) {
			Utils.setTitle(`Profile Page | ${settings.title}`);
			Utils.setDescription('');
			Utils.setMetaImage('');
		}

		if (!user) {
			return <LoadingPage />;
		}


		let showTabs = false;
		if (window.innerWidth > 800) {
			showTabs = true;
		}


		return (
			<MuiThemeProvider>
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
export default compose(settingsQuery)(ProfilePage);
