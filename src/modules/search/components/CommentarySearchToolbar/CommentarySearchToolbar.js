import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import autoBind from 'react-autobind';

// components
import SearchToolDropdown from '../SearchToolDropdown';
import KeywordsDropdown from '../KeywordsDropdown';
import KeyideasDropdown from '../KeyideasDropdown';
import CommentatorsDropdown from '../CommentatorsDropdown';
import ReferenceDropdown from '../ReferenceDropdown';
import WorksDropdown from '../WorksDropdown';
import LocationBrowserContainer from '../../containers/LocationBrowserContainer';


import './CommentarySearchToolbar.css';


/*
	BEGIN CommentarySearchToolbar
*/
class CommentarySearchToolbar extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchDropdownOpen: '',
			moreDropdownOpen: false,
			activeWorkNew: null,
			subworksTitle: 'Book',
			referenceWorks: [],
			works: [],
			keywords: [],
			keyideas: [],
			lineFrom: 0,
			lineTo: 909
		};

		// methods:
		if (props.handleChangeTextsearch) this.handleChangeTextsearch = _.debounce(props.handleChangeTextsearch, 300);
		autoBind(this);
	}

	toggleSearchDropdown(targetDropdown) {
		if (this.state.searchDropdownOpen === targetDropdown) {
			this.setState({
				searchDropdownOpen: '',
			});
		} else {
			this.setState({
				searchDropdownOpen: targetDropdown,
			});
		}
	}

	toggleMoreDropdown() {
		this.setState({
			moreDropdownOpen: !this.state.moreDropdownOpen,
		});
	}

	render() {
		const { toggleSearchTerm, filters, addCommentPage } = this.props;
		const {
			keywords, keyideas, commenters, referenceWorks, works, searchDropdownOpen,
			moreDropdownOpen,
		} = this.state;

		return (
			<div>
				{!addCommentPage ?
					<div className="search-tool text-search text-search--header">
						<TextField
							hintText=""
							floatingLabelText="Search"
							onChange={this.handleChangeTextsearch}
						/>
					</div>
					: '' }

				<WorksDropdown
					works={works}
					searchDropdownOpen={searchDropdownOpen}
					toggleSearchDropdown={this.toggleSearchDropdown}
					toggleSearchTerm={toggleSearchTerm}
					filters={filters}
				/>

				<LocationBrowserContainer
					urn={"urn:cts:greekLit:tlg0012.tlg001"}
				/>

				{!addCommentPage &&
					<SearchToolDropdown
						name="more"
						open={moreDropdownOpen}
						toggle={this.toggleMoreDropdown}
						disabled={false}
					>
						<div className="search-tool text-search">
							<TextField
								hintText=""
								floatingLabelText="Search"
								onChange={this.handleChangeTextsearch}
							/>
						</div>
						<KeywordsDropdown
							keywords={keywords}
							searchDropdownOpen={searchDropdownOpen}
							toggleSearchDropdown={this.toggleSearchDropdown}
							toggleSearchTerm={toggleSearchTerm}
							filters={filters}
						/>

						<KeyideasDropdown
							keyideas={keyideas}
							searchDropdownOpen={searchDropdownOpen}
							toggleSearchDropdown={this.toggleSearchDropdown}
							toggleSearchTerm={toggleSearchTerm}
							filters={filters}
						/>

						<CommentatorsDropdown
							commenters={commenters}
							searchDropdownOpen={searchDropdownOpen}
							toggleSearchDropdown={this.toggleSearchDropdown}
							toggleSearchTerm={toggleSearchTerm}
							filters={filters}
						/>

						<ReferenceDropdown
							reference={referenceWorks}
							searchDropdownOpen={searchDropdownOpen}
							toggleSearchDropdown={this.toggleSearchDropdown}
							toggleSearchTerm={toggleSearchTerm}
							filters={filters}
						/>

					</SearchToolDropdown>
				}
			</div>
		);
	}
}
/*
	END CommentarySearchToolbar
*/

CommentarySearchToolbar.propTypes = {
	filters: PropTypes.any, // eslint-disable-line react/forbid-prop-types
	toggleSearchTerm: PropTypes.func,
	handleChangeTextsearch: PropTypes.func,
	handlePagination: PropTypes.func,
	addCommentPage: PropTypes.bool,
	selectedWork: PropTypes.object,
	editionsQuery: PropTypes.object,
	referenceWorksQuery: PropTypes.object,
	commentersQuery: PropTypes.object,
	keywordsQuery: PropTypes.object
};

CommentarySearchToolbar.defaultProps = {
	keywords: [],
	keyideas: [],
	commenters: [],
	referenceWorks: [],
	works: [],
	filters: [],
	handleChangeTextsearch: null,
}

export default CommentarySearchToolbar;
