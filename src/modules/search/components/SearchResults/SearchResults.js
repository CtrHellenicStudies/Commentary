import React from 'react';
import PropTypes from 'prop-types';

import WorkTeaser from '../../../works/components/WorkTeaser';
import Pagination from '../../../../components/pagination/Pagination';

import './SearchResults.css';


class SearchResults extends React.Component {

	renderWorks() {
		const { handleSelectWork, works } = this.props;
		return works.map((work) => (
			<WorkTeaser
				key={work.id}
				work={work}
				handleSelectWork={handleSelectWork}
			/>
		));
	}

	render() {
		const { works, total } = this.props;

		return (
			<div
				className="worksList searchResultsList"
			>
				{works.length ?
					<div
						className="worksListInner"
					>
						{this.renderWorks()}
					</div>
					:
					<div className="worksListInner">
						<p className="noResults">
							No results found for your query.
						</p>
					</div>
				}

				<Pagination
					total={total}
					limit={30}
				/>
			</div>
		);
	}
}

SearchResults.propTypes = {
	works: PropTypes.array.isRequired,
};

export default SearchResults;
