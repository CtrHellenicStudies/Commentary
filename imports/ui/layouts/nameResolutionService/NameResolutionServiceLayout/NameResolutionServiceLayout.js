import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import Comments from '/imports/api/collections/comments';
import Tenants from '/imports/api/collections/tenants';
import Utils from '/imports/lib/utils';


const resolveV1 = props => {
	let resolveURL;
	let tenant;
	let comment;

	let urnParams = props.urn.split(':revision.');
	const urn = `urn${urnParams[0]}`;
	const revision = urnParams[1];

	const commentHandle = Meteor.subscribe('comments', { urn }, 0);
	comment = Comments.findOne({ urn });

	if (comment) {
		const tenantsHandle = Meteor.subscribe('tenants')
		tenant = Tenants.findOne({_id: comment.tenantId});
	}

	if (comment && tenant) {
		resolveURL = `//${tenant.subdomain}.${Utils.setCookieDomain()}/commentary/?urn=${urn}&revision=${revision}`;
	}

	return resolveURL;
};


class NameResolutionServiceLayout extends React.Component {

	static propTypes: {
		urn: PropTypes.string,
		doi: PropTypes.string,
		resolveURL: PropTypes.string,
	}

	resolve() {
		const { doi, urn, resolveURL } = this.props;

		if (!doi && !urn) {
			return (
				<div>
					<img
						className="site-logo"
						src="/images/CHS_Logo.png"
						role="presentation"
						alt="The Center for Hellenic Studies"
					/>
					<h1 className="title">Center for Hellenic Studies Commentaries | Name Resolution Service</h1>

					<div className="message">
						Supply Digital Object Identifier (DOI) or Uniform Resource Name (URN) to resolve.
					</div>
				</div>
			)
		}

		const identifier = doi || urn;

		if (!resolveURL) {
			return (
				<div>
					<img
						className="site-logo"
						src="/images/CHS_Logo.png"
						role="presentation"
						alt="The Center for Hellenic Studies"
					/>
					<h1 className="title">Center for Hellenic Studies Commentaries | Name Resolution Service</h1>

					<div className="message">
						Could not resolve Persistent Identifier {identifier}. Please consult a systems administrator if you feel that this is in error.
					</div>
				</div>
			)
		}

		window.location = resolveURL;
	}

	render() {

		return (
			<div className="nameResolutionServiceLayout">
				{this.resolve()}
			</div>
		)
	}
}

const nameResolutionServiceLayoutContainer = createContainer(props => {
	let resolveURL;

	switch(props.version) {
		case '1.0':
			resolveURL = resolveV1(props);
			break;
		default:
			resolveURL = resolveV1(props);
			break;
	}

	return {
		resolveURL,
	};
}, NameResolutionServiceLayout);


export default nameResolutionServiceLayoutContainer;
