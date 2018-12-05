import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import qs from 'qs-lite';
import autoBind from 'react-autobind';

// lib
import { parseValueUrn } from '../../../cts/lib/parseUrn';
import serializeUrn from '../../../cts/lib/serializeUrn';
import defaultWorksEditions from '../../../comments/lib/defaultWorksEditions';
import getCurrentSubdomain from '../../../../lib/getCurrentSubdomain';



class WorksSearchTermButton extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleChangeTextLocationWorksButton(key, value) {
		const queryParams = qs.parse(window.location.search.replace('?', ''));
		const subdomain = getCurrentSubdomain();
		let urn = value;
		let works = [];
		let refsDecls = [];

		if (defaultWorksEditions[subdomain] && defaultWorksEditions[subdomain].works) {
			works = defaultWorksEditions[subdomain].works;
			works.forEach(work => {
				if (urn.indexOf(work.urn) === 0) {
					refsDecls = work.refsDecls;
				}
			});
		}
		const parsedUrn = parseValueUrn(urn);
		parsedUrn.passage = [new Array(refsDecls.length).fill(1)];

		// update route
		const urlParams = qs.stringify(queryParams);
		this.props.history.push(`/commentary/${serializeUrn(parsedUrn)}/?${urlParams}`);
	}

	render() {
		const { label, value, active } = this.props;
		return (
			<li>
				<button
					className={`search-term-button ${(active) ? 'search-term-button--active' : ''}`}
					onClick={this.handleChangeTextLocationWorksButton.bind(this, 'works', value)}
				>
					<span className="search-term-button-label">
						{label}
					</span>
					<FontIcon
						className="mdi mdi-plus-circle-outline search-term-button-icon"
					/>
				</button>
			</li>
		);
	}
}

WorksSearchTermButton.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
	active: PropTypes.bool,
};

WorksSearchTermButton.defaultProps = {
	active: false,
};

export default withRouter(WorksSearchTermButton);
