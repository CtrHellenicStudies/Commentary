import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { Card } from 'material-ui/Card';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _s from 'underscore.string';


import './WorkTeaser.css';


// Work Teaser
class WorkTeaser extends React.Component {
	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	}

	render() {
		const { work } = this.props;
		const workUrl = `/texts/${work.id}/${work.slug}`;

		return (
			<Card
				className="workTeaser"
			>
				<div className="cardMetaLeft">
					<div className="cardMetaItems">
						{work.language ?
							<span className="cardMeta cardMetaLeftLanguage">
								{work.language.title}
							</span>
						: ''}
						{work.date ?
							<span className="cardMeta cardMetaLeftDate">
								{work.date}
							</span>
						:
							''
						}
						{work.translation ?
							<span className="cardMeta cardMetaLeftCorpus">
								{_s.prune(work.translation.title, 30)}
							</span>
						: ''}
					</div>
				</div>

				<a
					href={workUrl}
					className="workTeaserTitle"
				>
					<h3 >
						{_s.prune(work.english_title, 40)}
						{work.original_title && work.english_title !== work.original_title ?
							<span className="workTeaserOriginalTitle">
								{_s.prune(work.original_title, 40)}
							</span>
							:
							''
						}
					</h3>
				</a>

				<span className="workTeaserVersion">
					{work.version ? _s.prune(work.version.title, 90) : ''}
				</span>

				<div className="cardMetaBottom">
					<span className="cardMeta metaCountCommentary">
						{work.countComments || 0} Commentary
					</span>
					<span className="cardMeta metaCountTranslations">
						{work.countTranslations || 0} Translations
					</span>
					<span className="cardMeta metaCountAnnotations">
						{work.countAnnotations || 0} Annotations
					</span>
				</div>
			</Card>
		);
	}
}

WorkTeaser.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};

WorkTeaser.propTypes = {
	work: PropTypes.object.isRequired,
};

export default WorkTeaser;
