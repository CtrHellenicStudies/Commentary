import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';
import { Grid, Row, Col } from 'react-bootstrap';


// graphql
import settingsQuery from '../../../modules/settings/graphql/queries/list';
import tenantsQuery from '../../../modules/tenants/graphql/queries/tenants';


import './Footer.css';


class Footer extends Component {

	render() {
		const { tenantId, settingsQuery, tenantsQuery } = this.props;
		let settings = null;
		let tenant = null;

		if (settingsQuery && settingsQuery.settings) {
			settings = settingsQuery.loading ? {} : settingsQuery.settings.find(x => x.tenantId === tenantId);
			tenant = tenantsQuery.loading ? undefined : tenantsQuery.tenants.find(x => x._id === tenantId);
		}

		const now = new Date();
		const year = now.getFullYear();

		return (
			<footer className="block-shadow">
				<Grid>
					<Row>
						<div className="footer-nav-row">
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
					</Row>
					<Row>
						<div className="footerLogoRow clearfix">
							<Col md={5}>
								<h1 className="logo">{settings ? settings.name : undefined}</h1>
							</Col>

							<Col md={2}>
								<a href="http://chs.harvard.edu" target="_blank" rel="noopener noreferrer">
									<img
										className="site-logo"
										src="/images/center_for_hellenic_studies_lighthouse.png"
										role="presentation"
										alt="The Center for Hellenic Studies"
									/>
								</a>
							</Col>

							<Col md={5}>
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
							</Col>
						</div>
					</Row>
					<Row>
						<Col md={8} mdOffset={2}>
							<p className="fade-1-4 copyright">
								Copyright {year} The Center for Hellenic Studies.
								See our <a href="/terms">terms and privacy policy</a> and <a href="https://gdpr.harvard.edu/eeaprivacydisclosures" target="_blank" rel="noopener noreferrer">EU/EEA Privacy Disclosures</a>.
							</p>
						</Col>
					</Row>
				</Grid>
			</footer>

		);
	}
}

Footer.propTypes = {
	settingsQuery: PropTypes.object,
	tenantsQuery: PropTypes.object,
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	settingsQuery,
	tenantsQuery,
)(Footer);
