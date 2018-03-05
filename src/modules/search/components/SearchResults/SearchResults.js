import React from 'react';
import PropTypes from 'prop-types';

import WorkTeaser from '../../../works/components/WorkTeaser';
import Pagination from '../../../../components/pagination/Pagination';

import './SearchResults.css';


class SearchResults extends React.Component {

	renderWorks() {
		return this.props.works.map((work) => (
			<WorkTeaser
				key={work.id}
				work={work}
			/>
		));
	}

	render() {
		const { works, total, page, handleUpdatePagination } = this.props;

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
