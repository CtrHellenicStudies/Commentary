import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';



class NameResolutionServiceLayout extends React.Component {

	resolve() {
		window.location = this.props.resolveLink;
	}

	render() {
		const { doi, urn } = this.props;

		if (!doi || !urn) {
			return (
				<div>
					Supply Digital Object Identifier (DOI) or Uniform Resource Name (URN) to resolve.
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

		return (
			<div>
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
