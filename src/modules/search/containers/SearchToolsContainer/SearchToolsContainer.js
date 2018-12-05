import React from 'react';
import { withRouter } from 'react-router';
import { compose } from 'react-apollo';
import autoBind from 'react-autobind';

import SearchTools from '../../components/SearchTools';
import languageListQuery from '../../../languages/graphql/queries/list';


class SearchToolsContainer extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);
	}


	handleSubmit(values) {
	}

	render() {
		let languages = [];

		if (
			this.props.languageListQuery
      && this.props.languageListQuery.languages
      && this.props.languageListQuery.languages.length
		) {
			languages = this.props.languageListQuery.languages;
		}


		return (
			<SearchTools
				onSubmit={this.handleSubmit}
				languages={languages}
			/>
		);
	}
}

export default compose(
	withRouter,
	languageListQuery,
)(SearchToolsContainer);
