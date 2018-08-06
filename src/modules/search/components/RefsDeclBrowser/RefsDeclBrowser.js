import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
// import _s from 'underscore.string';

// components
import SearchToolDropdown from '../SearchToolDropdown';
import RefsDeclSearchTermButton from '../RefsDeclSearchTermButton';
import LineRangeSlider from '../LineRangeSlider';

// lib
import isActive from '../../../inputs/lib/isActive';
// import dropdownPropTypes, { dropdownDefaultProps } from '../../../inputs/lib/dropdownProps';


import './RefsDeclBrowser.css';


/**
 * Refs decl browser allows a user to browse through a work using arrow keys
 * For each work it should represent the document structure of that work, for
 * example, if a work's document structure (in the XML called RefsDecl) is
 * Book-Chapter, this component should allow a user to browse by Book and Chapter.
 * If a work's document structure is Book-Chapter-Section, it should allow a
 * user to browse by Book, Chapter, and Section.
 */
const RefsDeclBrowser = props => {
	const _refsDecls = props.refsDecls.slice();
	const lastRefsDecl = _refsDecls.pop();

	return (
		<div className="refsDeclBrowser">
			{_refsDecls.map(refsDecl => (
				<SearchToolDropdown
					key={refsDecl.slug}
					name={refsDecl.label.toString()}
					open={props.searchDropdownOpen === refsDecl.label}
					toggle={props.toggleSearchDropdown}
					disabled={false}
				>
					{_.range(refsDecl.range[0], refsDecl.range[1]).map((i, x) => (
						<RefsDeclSearchTermButton
							key={i}
							label={(i + 1).toString()}
							searchTermKey={refsDecl.slug}
							value={i + 1}
							active={isActive((i + 1), refsDecl.slug)}
						/>
					))}
				</SearchToolDropdown>
			))}
			<LineRangeSlider
				label={lastRefsDecl.label}
				handleChangeTextLocation={props.handleChangeTextLocation}
				lineFrom={lastRefsDecl.range[0] + 1}
				lineTo={lastRefsDecl.range[1] + 1}
			/>
		</div>
	);
}

RefsDeclBrowser.propTypes = {
	location: PropTypes.array,
	refsDecls: PropTypes.array,
};

export default RefsDeclBrowser;
