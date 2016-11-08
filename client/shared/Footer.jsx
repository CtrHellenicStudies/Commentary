import FlatButton from "material-ui/FlatButton";
import baseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";


Footer = React.createClass({

	getChildContext() {
		return {muiTheme: getMuiTheme(baseTheme)};
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},


	render() {
		const date = new Date();
		const year = date.getFullYear();

		const styles = {
			circleButton: {
				width: 'auto',
				height: 'auto',
			},
			circleButtonIcon: {
				color: '#ffffff',

			},
		};

		const user_is_loggedin = false;

		return (

			<footer className="block-shadow">
				<div className="container">
					<div className="row footer-nav-row">
						<div className="footer-nav-links" role="nav">
							<FlatButton
								href="/commentary/"
								label="Commentary"
							/>
							<FlatButton
								href="/commenters/"
								label="Commenters"
							/>
							<FlatButton
								href="/keywords/"
								label="Keywords"
							/>
							<FlatButton
								href="/keyideas/"
								label="Key Ideas"
							/>
							<FlatButton
								href="/about"
								label="About"
							/>
							{ user_is_loggedin ? '' :
								<div>
									<FlatButton
										href="#"
										label="Login"
									/>
									<FlatButton
										href="#"
										label="Join the Community"
									/>
								</div>
							}
						</div>
					</div>
					<div className="row mb64 mb-xs-32">
						<div className="col-md-5 text-right text-left-xs">
							<h1 className="logo">A Homer Commentary in Progress</h1>
						</div>

						<div className="col-md-2 hidden-sm hidden-xs text-center">
							<a href="http://chs.harvard.edu" target="_blank">
								<img className="site-logo" src="/images/logo-tower.png"/>
							</a>
						</div>

						<div className="col-md-5 col-sm-6">
							<p className="lead">
								For more information about the Commentary or general media inquiries, please contact <a
								href="mailto:contact@ahcip.chs.harvard.edu">contact@ahcip.chs.harvard.edu</a>.
							</p>

							<p className="lead">
								This website is provided by <a href="http://chs.harvard.edu" target="_blank">The Center
								for Hellenic Studies</a>.
							</p>

						</div>
					</div>
					{/* <!--end of row-->*/}
					<div className="row">
						<div className="col-md-8 col-md-offset-2 col-sm-9 col-sm-offset-1 text-center">
							<p className="fade-1-4 copyright">&copy; 2016 The Center for Hellenic Studies. See our <a
								href="/terms">terms and privacy policy</a>.</p>
						</div>
					</div>
					{/* <!--end of row-->*/}
				</div>
				{/* <!--end of container-->*/}
			</footer>

		);
	},
});
