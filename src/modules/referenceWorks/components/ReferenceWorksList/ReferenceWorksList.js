import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';

import Masonry from 'react-masonry-component/lib';

// graphql
import referenceWorksQuery from '../../graphql/queries/referenceWorksQuery';

// components
import ReferenceWorkTeaser from '../ReferenceWorkTeaser/ReferenceWorkTeaser';

class ReferenceWorksList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			referenceWorks: []
		};
	}
	componentWillReceiveProps(props) {

		if (props.referenceWorksQuery.loading) {
			return;
		}
		let referenceWorks;
		if (props.commenterId) {
			referenceWorks = props.referenceWorksQuery.referenceWorks.filter(x => x.authors.find(y => y === props.commenterId));
		} else {
			referenceWorks = props.referenceWorksQuery.referenceWorks;
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
