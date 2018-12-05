import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import SearchToolsContainer from '../../../search/containers/SearchToolsContainer';
import SearchResultsContainer from '../../../search/containers/SearchResultsContainer';

import { updatePage } from '../../../../actions/pagination';

class WorkSearchContainer extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentDidUpdate(prevProps) {
		if (
			prevProps.textsearch !== this.props.textsearch
      || prevProps.language !== this.props.language
		) {
			this.props.updatePage(1);
		}
	}

	render() {
		const { textsearch, language, page } = this.props;

		return (
			<div className="workSearchContainer">
				<SearchToolsContainer />
				<SearchResultsContainer
					textsearch={textsearch}
					language={language}
					page={page}
					offset={Math.abs(page - 1) * 30}
					handleSelectWork={this.props.handleSelectWork}
				/>
			</div>
		);
	}
}

WorkSearchContainer.defaultProps = {
	textsearch: '',
	language: null,
	page: 1,
};

const selector = formValueSelector('SearchTools');

const mapStateToProps = state => {
	const textsearch = selector(state, 'textsearch');
	const language = selector(state, 'language');

	return {
		textsearch,
		language,
  	page: state.pagination.page,
	};
};

const mapDispatchToProps = dispatch => ({
	updatePage: (page) => {
		dispatch(updatePage(page));
	},
});


export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(WorkSearchContainer);
