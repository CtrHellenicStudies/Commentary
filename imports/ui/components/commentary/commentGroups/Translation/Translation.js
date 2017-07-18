import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Translations from '/imports/api/collections/translations';
import _ from 'lodash';

class Translation extends React.Component {

	render() {
		const { lines, commentGroup, LinesWithTranslation } = this.props;
		const nLines = commentGroup.nLines;

		return (
			<div>
				{LinesWithTranslation.map(line => (
					<div className="row">
						<div className="col-md-7">
							<div
								key={line.n}
								className="lemma-text-line"
								style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'baseline'}}
							>
								<span className={`line-n ${(line.n % 5) === 0 ? 'line-n--visible' : ''}`}>
									{line.n}
								</span>
								<p								
									className="lemma-text"
									dangerouslySetInnerHTML={{ __html: line.html }}
								/>
							</div>
						</div>
						<div className="col-md-5">
							<div
								key={line.n}
								className="lemma-text-line"
								style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'baseline'}}
							>
								<p className="lemma-text">{line.english}</p>
							</div>
						</div>
					</div>
				))
					
				}
			</div>
		);
	}
}

export default createContainer(({ commentGroup, lines }) => {
	let translationQuery = {};

	if (commentGroup) {
		translationQuery = {
			author: 'CHS',
			subwork: Number(commentGroup.subwork.title),
			work: commentGroup.work.slug,
		};
	}
	console.log('commentGroup: ', commentGroup);
	console.log('translationQuery: ', translationQuery);

	const handle = Meteor.subscribe('translations', Session.get('tenantId'));

	console.log('Found ', Translations.find().fetch().length, ' translations.');
	console.log('Sample translation record: ', Translations.find().fetch()[0]);

	const translation = Translations.find(translationQuery).fetch();

	const translationLines = [];

	if (translation[0]) {
		console.log('Translation found.');
		const lineFrom = commentGroup.lineFrom;
		const lineTo = commentGroup.lineTo;

		const text = translation[0].revisions[0].text;

		const translationObjects = text.slice(lineFrom - 1, lineTo);
		for (const object of translationObjects) {
			translationLines.push(object.text);
		}
	}
	
	const LinesWithTranslation = _.zipWith(lines, translationLines, function(item, value) {
		return _.defaults({ english: value }, item);
	});

	console.log('lines with translations: ', LinesWithTranslation);

	return {
		LinesWithTranslation,
		ready: handle.ready(),
	};
}, Translation);

Translation.propTypes = {
	lines: React.PropTypes.arrayOf(React.PropTypes.shape({
		html: React.PropTypes.string.isRequired,
		n: React.PropTypes.number.isRequired,
	})).isRequired,
};


