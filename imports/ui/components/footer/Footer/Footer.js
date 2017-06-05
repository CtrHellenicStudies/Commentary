import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// api
import Settings from '/imports/api/collections/settings';
import Tenants from '/imports/api/collections/tenants';

// lib:
import muiTheme from '/imports/lib/muiTheme';


const Footer = React.createClass({

	propTypes: {
		settings: React.PropTypes.object,
		tenant: React.PropTypes.object,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},


	render() {
		const { settings, tenant } = this.props;
		const userIsLoggedin = false;

		return (

			<footer className="block-shadow">
				<div className="container">
					<div className="row footer-nav-row">
						<div className="footer-nav-links" role="navigation">
							{tenant && !tenant.isAnnotation ?
								<div>
									<FlatButton
										href="/commentary"
										label="Commentary"
									/>
									<FlatButton
										href="/commenters"
										label="Commentators"
									/>
									<FlatButton
										href="/keywords"
										label="Words"
									/>
									<FlatButton
										href="/keyideas"
										label="Ideas"
									/>
									<FlatButton
										href="/about"
										label="About"
									/>
								</div>
							: ''}
							{ userIsLoggedin ? '' :
							<div>
								<FlatButton
									href="/sign-in"
									label="Login"
								/>
								<FlatButton
									href="/sign-up"
									label="Join the Community"
								/>
							</div>
							}
						</div>
					</div>
					<div className="row mb64 mb-sm-32">
						<div className="col-md-5 text-right text-left-xs">
							<h1 className="logo">{settings ? settings.name : undefined}</h1>
						</div>

						<div className="col-md-2 hidden-sm hidden-xs text-center">
							<a href="http://chs.harvard.edu" target="_blank" rel="noopener noreferrer">
								<img className="site-logo" src="/images/logo-tower.png" role="presentation" />
							</a>
						</div>

						<div className="col-md-5 col-sm-6 more-info-column">
							<p className="lead">
								For more information about the Commentary or general media inquiries,
								please contact &nbsp;
								<a href={settings && settings.emails ? `mailto:${settings.emails.contact}` : ''}>
									{settings && settings.emails ? settings.emails.contact : ''}
								</a>.
							</p>

							<p className="lead">
								This website is provided by <a href="http://chs.harvard.edu" target="_blank" rel="noopener noreferrer">
									The Center for Hellenic Studies
								</a>.
							</p>

						</div>
					</div>
					{/* <!--end of row-->*/}
					<div className="row">
						<div className="col-md-8 col-md-offset-2 col-sm-9 col-sm-offset-1 text-center">
							<p className="fade-1-4 copyright">
								{settings ? settings.footer : undefined}.
								See our <a href="/terms">terms and privacy policy</a>
							</p>
						</div>
					</div>
					{/* <!--end of row-->*/}
				</div>
				{/* <!--end of container-->*/}
			</footer>

		);
	},
});

export default createContainer(() => {
	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

	return {
		settings: settingsHandle.ready() ? Settings.findOne() : {},
		tenant: Tenants.findOne({ _id: Session.get('tenantId') })
	};
}, Footer);
