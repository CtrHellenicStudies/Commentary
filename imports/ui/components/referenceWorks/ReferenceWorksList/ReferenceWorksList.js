import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { compose } from 'react-apollo';

import Masonry from 'react-masonry-component/lib';

// models
import ReferenceWorks from '/imports/models/referenceWorks';

// graphql
import { referenceWorksQuery } from '/imports/graphql/methods/referenceWorks';

// components
import ReferenceWorkTeaser from '/imports/ui/components/referenceWorks/ReferenceWorkTeaser';

// lib
import Utils from '/imports/lib/utils';


class ReferenceWorksList extends React.Component {

	renderReferenceWorks() {
		return this.props.referenceWorks.map((referenceWork, i) => (
			<ReferenceWorkTeaser
				key={i}
				referenceWork={referenceWork}
			/>
		));
	}

	render() {
		const { referenceWorks } = this.props;
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
	referenceWorks: PropTypes.array,
};

const ReferenceWorksListContainer = createContainer((props) => {
	const { commenterId } = props;
	// SUBSCRIPTIONS:
	const query = {};
	let referenceWorks;
	if (sessionStorage.getItem('tenantId')) {
		props.referenceWorksQuery.refetch({	
			tenantId: sessionStorage.getItem('tenantId')	
		});
	}
	if (commenterId) {
		referenceWorks = props.referenceWorksQuery.loading ? [] : props.referenceWorksQuery.referenceWorks.filter(x => x.commenterId === commenterId);
	} else {
		referenceWorks = props.referenceWorksQuery.loading ? [] : props.referenceWorksQuery.referenceWorks;
	}

	return {
		referenceWorks,
	};
}, ReferenceWorksList);

export default compose(referenceWorksQuery)(ReferenceWorksListContainer);
