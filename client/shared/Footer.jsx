import FlatButton from 'material-ui/FlatButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Settings from '/imports/collections/settings';


Footer = React.createClass({

	mixins: [ReactMeteorData],

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		const settingsHandle = Meteor.subscribe('settings.tenant', Session.get("tenantId"));

		return {
			settings: settingsHandle.ready() ? Settings.findOne() : {}
		};
	},

	render() {
		const userIsLoggedin = false;

		return (

			<footer className="block-shadow">
				<div className="container">
					<div className="row footer-nav-row">
						<div className="footer-nav-links" role="navigation">
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
								label="Keywords"
							/>
							<FlatButton
								href="/keyideas"
								label="Key Ideas"
							/>
							<FlatButton
								href="/about"
								label="About"
							/>
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
							<h1 className="logo">{this.data.settings ? this.data.settings.name : undefined}</h1>
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
								<a href={this.data.settings && this.data.settings.emails ? "mailto:"+this.data.settings.emails.contact : undefined}>
									{this.data.settings && this.data.settings.emails ? this.data.settings.emails.contact : undefined}
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
								{this.data.settings ? this.data.settings.footer : undefined}.
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
