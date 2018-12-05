import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import _s from 'underscore.string';


class KeywordContext extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedLemma: 0,
		};

		autoBind(this);
	}

	toggleEdition(newSelectedLemma) {
		if (this.state.selectedLemma !== newSelectedLemma && newSelectedLemma < this.state.lemmaText.length) {
			this.setState({
				selectedLemma: newSelectedLemma,
			});
		}
	}

	render() {
		const { keyword } = this.props;
		const { context, lemmaText } = this.state;

		if (!lemmaText || !lemmaText.length) {
			return null;
		}

		return (
			<article className="comment lemma-comment paper-shadow keyword-context">
				<div>
					<span className="lemma-comment-ref-header">
						{keyword.work.title} {keyword.subwork.n}.{keyword.lineFrom}{(keyword.lineTo && keyword.lineFrom !== keyword.lineTo) ? `-${keyword.lineTo}` : ''}
					</span>
					{lemmaText[this.state.selectedLemma].lines.map((line, i) =>
						(<p
							key={i}
							className="lemma-text"
							dangerouslySetInnerHTML={{ __html: line.html }}
						/>)
					)}
				</div>
				<div className="version-tabs tabs">
					{
						lemmaText.map((lemmaTextEdition, i) => {
							const lemmaEditionTitle = _s.truncate(lemmaTextEdition.title, 20);

							return (
								<RaisedButton
									key={i}
									label={lemmaEditionTitle}
									data-edition={lemmaTextEdition.title}
									className={this.state.selectedLemma === i ? 'version-tab tab selected-version-tab' : 'version-tab tab'}
									onClick={this.toggleEdition.bind(null, i)}
								/>
							);
						})
					}
				</div>
				<div className="context-tabs tabs">
					<RaisedButton
						className="context-tab tab"
						href={`/commentary/?works=${context.work}&subworks=${context.subwork
						}&lineFrom=${context.lineFrom}&lineTo=${context.lineTo}`}
						label="Context"
						labelPosition="before"
						icon={<FontIcon className="mdi mdi-chevron-right" />}
					/>
				</div>
			</article>
		);
	}
}

KeywordContext.propTypes = {
	keyword: PropTypes.object,
	editionsQuery: PropTypes.object,
	commentsQuery: PropTypes.object,
	textNodesQuery: PropTypes.object,
	maxLines: PropTypes.number
};

export default KeywordContext;
