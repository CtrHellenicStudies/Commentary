import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import _ from 'underscore';

import ItemList from '../../components/ItemList';
import itemListQuery from '../../graphql/queries/list';


class ItemListContainer extends React.Component {
	render() {
		let items = [];
		console.log(this.props);
		console.log(this.props);
		console.log(this.props);
		console.log(this.props);

		if (
			this.props.itemListQuery
			&& this.props.itemListQuery.ORPHEUS_project
		) {
			items = this.props.itemListQuery.ORPHEUS_project.items;
		}

		if (
			items.length
			&& this.props.limit
			&& this.props.random
			&& items.length > this.props.limit
		) {
			let _items = [];

			for (let i = 0; i < this.props.limit; i++){
				_items.push(_.sample(items));
			}

			items = _items;
		}

		return (
			<ItemList
				items={items}
			/>
		);
	}
}

ItemListContainer.propTypes = {
	itemListQuery: PropTypes.object,
};

export default compose(
	itemListQuery,
)(ItemListContainer);
