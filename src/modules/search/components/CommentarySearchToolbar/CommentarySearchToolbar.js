import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import autoBind from 'react-autobind';
import { withRouter } from 'react-router';

// components
import SearchToolDropdown from '../SearchToolDropdown';
import KeywordsDropdown from '../KeywordsDropdown';
import KeyideasDropdown from '../KeyideasDropdown';
import CommentatorsDropdown from '../CommentatorsDropdown';
import ReferenceDropdown from '../ReferenceDropdown';
import WorksDropdown from '../WorksDropdown';
import LocationBrowserContainer from '../../containers/LocationBrowserContainer';

// lib
import toggleSearchTerm from '../../lib/toggleSearchTerm';
import defaultWorksEditions from '../../../comments/lib/defaultWorksEditions';
import getCurrentSubdomain from '../../../../lib/getCurrentSubdomain';


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
		const subdomain = getCurrentSubdomain();
		const {
			searchDropdownOpen, moreDropdownOpen,
		} = this.state;
		const {
			words, ideas, commenters, referenceWorks, works, filters, addCommentPage,
		} = this.props;

		let urn;

		if (
			this.props.match
			&& this.props.match.params
			&& this.props.match.params.urn
		) {
			urn = this.props.match.params.urn;
		} else if (defaultWorksEditions[subdomain]) {
			urn = defaultWorksEditions[subdomain].defaultWorkUrn;
		}

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
					urn={urn}
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
							keywords={words}
							searchDropdownOpen={searchDropdownOpen}
							toggleSearchDropdown={this.toggleSearchDropdown}
							toggleSearchTerm={toggleSearchTerm}
							filters={filters}
						/>

						<KeyideasDropdown
							keyideas={ideas}
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
	keywords: PropTypes.array,
	keyideas: PropTypes.array,
	commenters: PropTypes.array,
	referenceWorks: PropTypes.array,
	works: PropTypes.array,
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

export default withRouter(CommentarySearchToolbar);
