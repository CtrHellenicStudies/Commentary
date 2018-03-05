import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import SearchToolsContainer from '../../../search/containers/SearchToolsContainer';
import SearchResultsContainer from '../../../search/containers/SearchResultsContainer';


class WorkSearchContainer extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      page: 1,
    };
  }

  handleUpdatePagination(page) {
    this.setState({
      page,
    });
  }

	render() {
    const { textsearch, language } = this.props;
		const { page } = this.state;

		return (
			<div className="workSearchContainer">
				<SearchToolsContainer />
				<SearchResultsContainer
					textsearch={textsearch}
					language={language}
          page={page}
					offset={Math.abs(page - 1) * 30}
          handleSelectWork={this.props.handleSelectWork}
          handleUpdatePagination={this.handleUpdatePagination}
				/>
			</div>
		);
	}
}

WorkSearchContainer.defaultProps = {
  textsearch: '',
  language: null,
};

const selector = formValueSelector('SearchTools');

export default connect(
  state => {
    // can select values individually
    const textsearch = selector(state, 'textsearch')
    const language = selector(state, 'language')
    return {
      textsearch,
      language,
    };
  }
)(WorkSearchContainer);
