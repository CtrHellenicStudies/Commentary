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



class RefsDeclSearchTermButton extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleChangeTextLocationRefsDeclButton(key, value) {
		const queryParams = qs.parse(window.location.search.replace('?', ''));
		const subdomain = getCurrentSubdomain();
		let urn;
		let location = [];
		let works = [];
		let refsDecls = [];

		if (
			this.props.match
			&& this.props.match.params
			&& this.props.match.params.urn
		) {
			urn = this.props.match.params.urn;
		} else if (defaultWorksEditions[subdomain]) {
			urn = defaultWorksEditions[subdomain].defaultWorkUrn;
		}

		if (defaultWorksEditions[subdomain] && defaultWorksEditions[subdomain].works) {
			works = defaultWorksEditions[subdomain].works;
			works.forEach(work => {
				if (urn.indexOf(work.urn) === 0) {
					refsDecls = work.refsDecls;
				}
			});
		}

		const parsedUrn = parseValueUrn(urn);
		if (parsedUrn.passage && parsedUrn.passage.length) {
			location = parsedUrn.passage[0];
		} else {
			location = new Array(refsDecls.length).fill(1);
		}


		refsDecls.forEach((refsDecl, i) => {
			if (key === refsDecl.slug) {
				location[i] = value;
			}
		});

		parsedUrn.passage = [location];

		// update route
		const urlParams = qs.stringify(queryParams);
		this.props.history.push(`/commentary/${serializeUrn(parsedUrn)}/?${urlParams}`);
	}

	render() {
		const { label, searchTermKey, value, active } = this.props;
		return (
			<li>
				<button
					className={`search-term-button ${(active) ? 'search-term-button--active' : ''}`}
					onClick={this.handleChangeTextLocationRefsDeclButton.bind(this, searchTermKey, value)}
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

RefsDeclSearchTermButton.propTypes = {
	label: PropTypes.string.isRequired,
	searchTermKey: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
	active: PropTypes.bool,
};

RefsDeclSearchTermButton.defaultProps = {
	active: false,
};

export default withRouter(RefsDeclSearchTermButton);
