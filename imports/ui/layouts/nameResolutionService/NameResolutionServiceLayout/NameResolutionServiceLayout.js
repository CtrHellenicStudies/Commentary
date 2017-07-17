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

	const commentHandle = Meteor.subscribe('comments', { urn: props.urn }, 0);
	comment = Comments.findOne({ urn: props.urn });

	if (comment) {
		const tenantsHandle = Meteor.subscribe('tenants')
		tenant = Tenants.findOne({_id: comment.tenantId});
	}

	if (comment && tenant) {
		resolveURL = `//${tenant.subdomain}.${Utils.setCookieDomain()}/?urn=${props.urn}`;
	}

	return resolveURL;
};



class NameResolutionServiceLayout extends React.Component {

	resolve() {
		const { doi, urn } = this.props;

		if (!doi || !urn) {
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
					Could not resolve Persistent Identifier {identifier}. Please consult a systems administrator if you feel that this is in error.
				</div>
			)
		}

		// window.location = this.props.resolveURL;
		console.log(this.props.resolveURL);
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
	let urn;
	let doi;
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
