import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import _ from 'underscore';

import ItemEmbed from '../../components/ItemEmbed';
import itemDetailQuery from '../../graphql/queries/detail';


class ItemEmbedContainer extends React.Component {
	render() {
		let item = null;
		console.log(this.props);
		console.log(this.props);
		console.log(this.props);
		console.log(this.props);

		if (
			this.props.itemDetailQuery
			&& this.props.itemDetailQuery.ORPHEUS_project
		) {
			item = this.props.itemDetailQuery.ORPHEUS_project.item;
		}

		if (!item) {
			return null;
		}

		return (
			<ItemEmbed
				{...item}
			/>
		);
	}
}

ItemEmbedContainer.propTypes = {
	itemDetailQuery: PropTypes.object,
};

export default compose(
	itemDetailQuery,
)(ItemEmbedContainer);
