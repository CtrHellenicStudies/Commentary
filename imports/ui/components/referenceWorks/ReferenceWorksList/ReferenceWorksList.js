import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { compose } from 'react-apollo';

import Masonry from 'react-masonry-component/lib';

// graphql
import { referenceWorksQuery } from '/imports/graphql/methods/referenceWorks';

// components
import ReferenceWorkTeaser from '/imports/ui/components/referenceWorks/ReferenceWorkTeaser';

// lib
import Utils from '/imports/lib/utils';


class ReferenceWorksList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};

		this.props.referenceWorksQuery.refetch({	
			tenantId: sessionStorage.getItem('tenantId')	
		});
	}
	componentWillReceiveProps(props) {

		let referenceWorks;
		if (props.commenterId) {
			referenceWorks = props.referenceWorksQuery.loading ? [] : props.referenceWorksQuery.referenceWorks.filter(x => x.commenterId === props.commenterId);
		} else {
			referenceWorks = props.referenceWorksQuery.loading ? [] : props.referenceWorksQuery.referenceWorks;
		}
		this.setState({
			referenceWorks: referenceWorks
		});
	}
	renderReferenceWorks() {
		return this.state.referenceWorks.map((referenceWork, i) => (
			<ReferenceWorkTeaser
				key={i}
				referenceWork={referenceWork}
			/>
		));
	}
	
	render() {
		const { referenceWorks } = this.state;
		const masonryOptions = {
			isFitWidth: true,
			transitionDuration: 300,
		};

		if (!referenceWorks) {
			return null;
		}

		return (
			<div>
				{referenceWorks.length ?
					<Masonry
						options={masonryOptions}
						className="reference-works-list"
					>
						{this.renderReferenceWorks()}
					</Masonry>
					:
					<p className="no-results no-results-reference-works">No reference works found.</p>
				}
			</div>
		);
	}

}

ReferenceWorksList.propTypes = {
	commenterId: PropTypes.string,
	referenceWorksQuery: PropTypes.object,
};

export default compose(referenceWorksQuery)(ReferenceWorksList);
