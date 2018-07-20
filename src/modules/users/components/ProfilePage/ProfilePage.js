import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoBind from 'react-autobind';

// components
import AvatarEditor from '../AvatarEditor';
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder';
import ModalChangePwd from '../../../auth/components/ModalChangePwd';
import Discussion from '../Discussion';
import Annotations from '../Annotations';
import Account from '../Account';
import Header from '../../../../components/navigation/Header';

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

class ProfilePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			annotationCheckList: [],
			usernameError: '',
			emailError: '',
			modalChangePwdLowered: false,
			isPublicEmail: false,
		};

		autoBind(this);
	}

	static childContextTypes = {
		muiTheme: PropTypes.object.isRequired,
	}

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
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

		if (settings) {
			Utils.setTitle(`Profile Page | ${settings.title}`);
			Utils.setDescription('');
			Utils.setMetaImage('');
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
												<Discussion />
											</Tab>
											<Tab label="Annotations">
												<Annotations />
											</Tab>
											<Tab label="Account">
												<MuiThemeProvider>
													<Account turnOnPassChange={this.showChangePwdModal} />
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
						: ''}
				</div>
			</MuiThemeProvider>
		);
	}
}

export default ProfilePage;
