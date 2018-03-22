import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import Utils from '../../../../lib/utils';

// graphql
import commentsQuery from '../../../comments/graphql/queries/comments';
import { tenantsQuery } from '../../../../graphql/methods/tenants';

import './NameResolutionServiceLayout.css';


const resolveV1 = (props) => {
	let resolveURL;
	let tenant;

	if (!props.doi && !props.urn) {
		return resolveURL;
	}

	const urnParams = props.urn.split('.');
	const revision = urnParams.splice(-1);
	const urn = `${urnParams.join('.')}`;

	if (!props.commentsQuery.variables.queryParam) {
		props.commentsQuery.refetch({
			queryParam: JSON.stringify({_id: props.commentId})
		});
	}
	const comment = props.commentsQuery.loading ? {} : props.commentsQuery.comments[0];
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

	if (!props.commentsQuery.variables.queryParam) {
		props.commentsQuery.refetch({
			queryParam: JSON.stringify({_id: props.commentId})
		});
	}
	const comment = props.commentsQuery.loading ? {} : props.commentsQuery.comments[0];

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


class NameResolutionServiceLayout extends Component {

	componentWillReceiveProps(nextProps) {
		let resolveURL;
		switch (nextProps.version) {
		case 1:
			resolveURL = resolveV1(nextProps);
			break;
		case 2:
			resolveURL = resolveV2(nextProps);
			break;
		default:
			resolveURL = resolveV1(nextProps);
			break;
		}
		this.setState({
			resolveURL: resolveURL
		});
	}
	resolve() {
		const { doi, urn } = this.props;
		const { resolveURL } = this.state;

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
NameResolutionServiceLayout.propTypes = {
	urn: PropTypes.string,
	doi: PropTypes.string,
	resolveURL: PropTypes.string,
	version: PropTypes.number
};
export default compose(
	tenantsQuery,
	commentsQuery
)(NameResolutionServiceLayout);
