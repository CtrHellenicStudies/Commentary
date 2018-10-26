import React from 'react';
import { compose } from 'react-apollo';
import Select from 'react-select';
import autoBind from 'react-autobind';

import keywordsQuery from '../../../../keywords/graphql/queries/list';


class TagsInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedOption: null,
		};
		autoBind(this);
	}

	handleChange(selectedOption) {
		this.setState({ selectedOption });
	}

	render() {
		const { keywordsQuery } = this.props;
		const { selectedOption } = this.state;
		const options = [];
		let tags = [];

		if (keywordsQuery && keywordsQuery.keywords) {
			tags = keywordsQuery.keywords;
		}

		tags.forEach(tag => {
			options.push({
				value: tag._id,
				label: tag.title,
			});
		});

		return (
			<div className="tagsInput">
				<Select
					value={selectedOption}
					onChange={this.handleChange}
					options={options}
					multi
				/>
			</div>
		);
	}
}

export default compose(
	keywordsQuery,
)(TagsInput);
