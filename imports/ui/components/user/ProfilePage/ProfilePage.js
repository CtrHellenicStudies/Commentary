import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { createContainer } from 'meteor/react-meteor-data';

// components
import AvatarEditor from '/imports/ui/components/avatar/AvatarEditor';
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';
import ModalChangePwd from '/imports/ui/layouts/auth/ModalChangePwd';
import Notifications from '/imports/ui/components/user/ProfilePage/Notifications';
import Discussions from '/imports/ui/components/user/ProfilePage/Discussions';
import Annotations from '/imports/ui/components/user/ProfilePage/Annotations';
import Bookmarks from '/imports/ui/components/user/ProfilePage/Bookmarks';
import Account from '/imports/ui/components/user/ProfilePage/Account';

//api
import Settings from '/imports/models/settings';

// lib
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';

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
			isPublicEmail: false
		};

		this.getChildContext = this.getChildContext.bind(this);
		this.loadMore = this.loadMore.bind(this);
		this.showChangePwdModal = this.showChangePwdModal.bind(this);
		this.closeChangePwdModal = this.closeChangePwdModal.bind(this);
	}

	static propTypes = {
		user: PropTypes.object,
		settings: PropTypes.object,
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
		const { user, settings } = this.props;

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
			<div className="page page-user-profile">
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
											<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
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
		);
	}
}

export default createContainer(() => {
	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

	return {
		user: Meteor.user(),
		settings: Settings.findOne(),
		ready: settingsHandle.ready(),
	};
}, ProfilePage);