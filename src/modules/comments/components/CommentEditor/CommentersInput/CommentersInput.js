import React from 'react';
import { compose } from 'react-apollo';
import Select from 'react-select';
import autoBind from 'react-autobind';

import commentersQuery from '../../../../commenters/graphql/queries/list';


class CommentersInput extends React.Component {
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
		const { commentersQuery } = this.props;
		const { selectedOption } = this.state;
		const options = [];
		let commenters = [];

		if (commentersQuery && commentersQuery.commenters) {
			commenters = commentersQuery.commenters;
		}

		commenters.forEach(commenter => {
			options.push({
				value: commenter._id,
				label: commenter.name,
			});
		});

		return (
			<div className="commentersInput">
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
	commentersQuery,
)(CommentersInput);
