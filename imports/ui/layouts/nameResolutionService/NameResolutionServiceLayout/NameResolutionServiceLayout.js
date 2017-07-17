import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';



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

		if (!resolveLink) {
			return (
				<div>
					Could not resolve Persistent Identifier {identifier}. Please consult a systems administrator if you feel that this is in error.
				</div>
			)
		}
		window.location = this.props.resolveLink;
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
	let resolveLink;

	return {
		resolveLink,
	};
}, NameResolutionServiceLayout);


export default nameResolutionServiceLayoutContainer;
