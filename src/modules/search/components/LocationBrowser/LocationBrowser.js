import React from 'react';
import PropTypes from 'prop-types';
import _s from 'underscore.string';


import './LocationBrowser.css';

/**
 * Location browser allows a user to browse through a work using arrow keys
 * For each work it should represent the document structure of that work, for
 * example, if a work's document structure (in the XML called RefsDecl) is
 * Book-Chapter, this component should allow a user to browse by Book and Chapter.
 * If a work's document structure is Book-Chapter-Section, it should allow a
 * user to browse by Book, Chapter, and Section.
 */
export default class LocationBrowser extends React.Component {

	/*
	constructor(props) {
		super(props);

	}
	*/

	increaseEdition() {
	}

	increaseChapter() {
	}

	decreaseEdition() {
	}

	decreaseChapter() {
	}

	renderLocationBrowserText() {
		const { location, refsDecls } = this.props;

		let locationBrowserText = '';

		refsDecls.forEach((refsDecl, i) => {
			let refLocation = 1;

			// set ref location
			if (i < location.length && location[i]) {
				refLocation = location[i];
			}

			locationBrowserText += `${_s(refsDecl.label).capitalize().value()} ${refLocation}`;

			// Add trailing comma
			if (i < refsDecls.length - 1) {
				locationBrowserText += ', ';
			}
		});


		return (
			<span>
				{locationBrowserText}
			</span>
		);
	}

	render() {

		return (
			<div className="locationBrowser">
				<div className="locationBrowserInner">
					<button onClick={this.decreaseEdition} className="locationBrowserButton">
						<i className="mdi mdi-chevron-double-left"></i>
					</button>
					<button onClick={this.decreaseChapter} className="locationBrowserButton">
						<i className="mdi mdi-chevron-left"></i>
					</button>
					<span className="locationBrowserText">
						{this.renderLocationBrowserText()}
					</span>
					<button onClick={this.increaseChapter} className="locationBrowserButton">
						<i className="mdi mdi-chevron-right"></i>
					</button>
					<button onClick={this.increaseEdition} className="locationBrowserButton">
						<i className="mdi mdi-chevron-double-right"></i>
					</button>
				</div>
			</div>
		);
	}
}

LocationBrowser.propTypes = {
	maxChapter: PropTypes.number,
	maxEdition: PropTypes.number,
	updateTextLocation: PropTypes.func,
};
