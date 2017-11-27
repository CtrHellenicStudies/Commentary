import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { compose } from 'react-apollo';
import { tenantsQuery } from '/imports/graphql/methods/tenants';
import Comments from '/imports/models/comments';
import Utils from '/imports/lib/utils';


const resolveV1 = (props) => {
	let resolveURL;
	let tenant;

	if (!props.doi && !props.urn) {
		return resolveURL;
	}

	const urnParams = props.urn.split('.');
	const revision = urnParams.splice(-1);
	const urn = `${urnParams.join('.')}`;

	const commentHandle = Meteor.subscribe('comments', {_id: props.commentId}, 0);
	const comment = Comments.findOne({ _id: props.commentId });

	if (comment) {
		this.props.tenantsQuery.variables.tenantId = comment.tenantId;
		tenant = this.props.tenantsQuery.loading ? {} : this.props.tenantsQuery.tenants;
	}

	if (comment && tenant) {
		resolveURL = `//${tenant.subdomain}.${Utils.getEnvDomain()}/commentary/?urn=${urn}&revision=${revision}`;
	}

	return resolveURL;
};
const resolveV2 = (props) => {
	let resolveURL;
	let tenant;
	if (!props.doi && !props.urn) {
		return resolveURL;
	}
	const urnParams = props.urn.split('.');
	const revision = urnParams.splice(-1);
	const urn = `${urnParams.join('.')}`;

	const commentHandle = Meteor.subscribe('comments', {_id: props.commentId});
	const comment = Comments.findOne({ _id: props.commentId });

	if (comment) {
		this.props.tenantsQuery.variables.tenantId = comment.tenantId;
		tenant = this.props.tenantsQuery.loading ? {} : this.props.tenantsQuery.tenants;
	}

	if (comment && tenant) { 
		// TODO
		resolveURL = `//${tenant.subdomain}.${Utils.getEnvDomain()}/commentary/?urn=${urn}&revision=${revision}`;
	}

	return resolveURL;
};


class NameResolutionServiceLayout extends React.Component {

	static propTypes = {
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
			);
		}

		let identifier = doi || urn;

		if (doi) {
			identifier = `doi${identifier}`;
		} else if (urn) {
			identifier = `urn${identifier}`;
		}

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
			);
		}

		window.location = resolveURL;
		return <div />;
	}

	render() {

		return (
			<div className="nameResolutionServiceLayout">
				{this.resolve()}
			</div>
		);
	}
}

const nameResolutionServiceLayoutContainer = createContainer((props) => {
	let resolveURL;
	switch (props.version) {
	case 1:
		resolveURL = resolveV1(props);
		break;
	case 2:
		resolveURL = resolveV2(props);
		break;
	default:
		resolveURL = resolveV1(props);
		break;
	}

	return {
		resolveURL,
	};
}, NameResolutionServiceLayout);


export default compose(tenantsQuery)(nameResolutionServiceLayoutContainer);
