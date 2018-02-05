import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';

// graphql
import { settingsQuery } from '../../graphql/methods/settings';
import { tenantsQuery } from '../../graphql/methods/tenants';



class Footer extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillReceiveProps(props) {
		const tenantId = sessionStorage.getItem('tenantId');

		this.setState({
			settings: props.settingsQuery.loading ? {} : props.settingsQuery.settings.find(x => x.tenantId === tenantId),
			tenant: props.tenantsQuery.loading ? undefined : props.tenantsQuery.tenants.find(x => x._id === tenantId)
		});
	}
	render() {
		const { settings, tenant } = this.state;
		const now = new Date();
		const year = now.getFullYear();

		return (

			<footer className="block-shadow">
				<div className="container">
					<div className="row footer-nav-row">
						<div className="footer-nav-links" role="navigation">
							{tenant && !tenant.isAnnotation ?
								<div>
									<Link to="/commentary">
										<FlatButton
											label="Commentary"
										/>
									</Link>
									<Link to="/commenters">
										<FlatButton
											label="Commentators"
										/>
									</Link>
									<Link to="/words">
										<FlatButton
											label="Words"
										/>
									</Link>
									<Link to="/ideas">
										<FlatButton
											label="Ideas"
										/>
									</Link>
									<Link to={settings && settings.aboutURL ? settings.aboutURL : '/about'}>
										<FlatButton
											label="About"
										/>
									</Link>
								</div>
							: ''}
						</div>
					</div>
					<div className="row mb64 mb-sm-32">
						<div className="col-md-5 text-right text-left-xs">
							<h1 className="logo">{settings ? settings.name : undefined}</h1>
						</div>

						<div className="col-md-2 hidden-sm hidden-xs text-center">
							<a href="http://chs.harvard.edu" target="_blank" rel="noopener noreferrer">
								<img
									className="site-logo"
									src="/images/center_for_hellenic_studies_lighthouse.png"
									role="presentation"
									alt="The Center for Hellenic Studies"
								/>
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
								Copyright {year} The Center for Hellenic Studies.
								See our <a href="/terms">terms and privacy policy</a>
							</p>
						</div>
					</div>
					{/* <!--end of row-->*/}
				</div>
				{/* <!--end of container-->*/}
			</footer>

		);
	}
}
Footer.propTypes = {
	settingsQuery: PropTypes.object,
	tenantsQuery: PropTypes.object,
};
export default compose(settingsQuery, tenantsQuery)(Footer);
