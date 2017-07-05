import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { Sticky } from 'react-sticky';
import FlatButton from 'material-ui/FlatButton';

import Utils from '/imports/lib/utils';

// api:
import TextNodes from '/imports/api/collections/textNodes'; 

// components:
import CommentLemmaText from '/imports/ui/components/commentary/commentGroups/CommentLemmaText'; 
import CommentGroupMeta from '/imports/ui/components/commentary/commentGroups/CommentGroupMeta';  

class Translation extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			expanded: false,
		};
	}

	_toggleExpanded() {
		const { expanded } = this.state;

		this.setState({
			expanded: !expanded,
		});
	}

	render() {
		const { lines } = this.props;
		const { expanded } = this.state;

		const textLenghtBound = 10;
		const longText = lines.length > textLenghtBound;

		// if long text
		if (longText) {
			const loops = expanded ? lines.length : textLenghtBound;
			const linesXML = [];

			// construct the XML to be rendered
			// number of lines depended on the expanded state
			for (let i = 0; i < loops; i += 1) {
				linesXML.push(
					<div
						key={i}
						className="lemma-text-line"
					>
						<div className="col-md-8">
							<span className={`line-n ${(lines[i].n % 5) === 0 ? 'line-n--visible' : ''}`}>
								{lines[i].n}
							</span>
							<p
								className="lemma-text"
								dangerouslySetInnerHTML={{ __html: lines[i].html }}
							/>
						</div>
						<div className="col-md-4">
							<p>hey now</p>
						</div>
					</div>
				);
			}

			return (
				<div>
					{linesXML}
					<div>
						<FlatButton
							label={expanded ? 'Show less' : 'Show more'}
							icon={expanded ? <i className="mdi mdi-chevron-up" /> : <i className="mdi mdi-chevron-down" />}
							onClick={this._toggleExpanded.bind(this)}
						/>
					</div>
				</div>
			);
		}

		// if not longText
		return (
			<div>
				{lines.map((line, i) => (
					<div
						key={i}
						className="lemma-text-line"
					>
						<span className={`line-n ${(line.n % 5) === 0 ? 'line-n--visible' : ''}`}>
							{line.n}
						</span>
						<p
							className="lemma-text"
							dangerouslySetInnerHTML={{ __html: line.html }}
						/>
					</div>
				))}
			</div>
		);
	}
}

CommentLemmaText.propTypes = {
	lines: React.PropTypes.arrayOf(React.PropTypes.shape({
		html: React.PropTypes.string.isRequired,
		n: React.PropTypes.number.isRequired,
	})).isRequired,
};

export default Translation;
