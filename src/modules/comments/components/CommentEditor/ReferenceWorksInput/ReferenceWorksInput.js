import React from 'react';
import { compose } from 'react-apollo';
import Select from 'react-select';
import autoBind from 'react-autobind';

import referenceWorksQuery from '../../../../referenceWorks/graphql/queries/list';


class ReferenceWorksInput extends React.Component {
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
		const { referenceWorksQuery } = this.props;
		const { selectedOption } = this.state;
		const options = [];
		let referenceWorks = [];

		if (referenceWorksQuery && referenceWorksQuery.referenceWorks) {
			referenceWorks = referenceWorksQuery.referenceWorks;
		}

		referenceWorks.forEach(referenceWork => {
			options.push({
				value: referenceWork._id,
				label: referenceWork.title,
			});
		});

		return (
			<div className="referenceWorksInput">
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
	referenceWorksQuery,
)(ReferenceWorksInput);
