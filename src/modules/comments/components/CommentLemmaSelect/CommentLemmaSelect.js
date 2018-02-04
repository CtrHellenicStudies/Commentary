import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

// graphql
import { editionsQuery } from '../../../../graphql/methods/editions';

// lib:
import Utils from '../../../../lib/utils';


class CommentLemmaSelect extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedLemmaEdition: '',
			lineLetterValue: '',
		};
		this.onLineLetterValueChange = this.onLineLetterValueChange.bind(this);
		this.toggleEdition = this.toggleEdition.bind(this);

	}
	areQueriesStillLoadingOrTextNodesFromParent(props) {
		let ret = false;
		if(!props.textNodes) {
			ret = true;
		} else if (props.editionsQuery.loading && 
			!(props.lineFrom !== this.props.lineFrom 
			|| props.lineTo !== this.props.lineTo)) {
				ret = true;
		}
		return ret;
	}
	componentWillReceiveProps(nextProps) {
		if (this.areQueriesStillLoadingOrTextNodesFromParent(nextProps)) {
			return;
		}
		const editions = Utils.textFromTextNodesGroupedByEdition(nextProps.textNodes, nextProps.editionsQuery.collections[0].textGroups[0].works);

		this.setState({
			lemmaText: editions,
			selectedLemmaEdition: editions[0],
		});
	}
	onLineLetterValueChange(event) {
		this.setState({
			lineLetterValue: event.target.value,
		});
	}

	toggleEdition(editionSlug) {
		if (this.state.selectedLemmaEdition !== editionSlug) {
			this.setState({
				selectedLemmaEdition: editionSlug,
			});
		}
	}
	render() {
		const self = this;
		return (
			<div className="comments lemma-panel-visible">
				<div className="comment-outer comment-lemma-comment-outer">

					{this.props.lineFrom > 0 &&
						this.state.selectedLemmaEdition &&
						this.state.selectedLemmaEdition.lines ?
							<article className="comment lemma-comment paper-shadow">

								{this.state.selectedLemmaEdition.lines.map((line, i) => (
									<p
										key={i}
										className="lemma-text"
										dangerouslySetInnerHTML={{ __html: line.html }}
									/>
							))}

								{self.props.lineTo === 0 ?
									<div>
										<TextField
											name="lineLetter"
											id="lineLetter"
											required={false}
											floatingLabelText="Line letter..."
											value={this.state.lineLetterValue}
											onChange={this.onLineLetterValueChange}
										/>
									</div>
								:
								''
							}

								<div className="version-tabs tabs">
									{this.state.lemmaText.map((lemmaTextEdition, i) => {
										const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

										return (<RaisedButton
											key={i}
											label={lemmaEditionTitle}
											data-edition={lemmaTextEdition.title}
											className={self.state.selectedLemmaEdition.slug === lemmaTextEdition.slug ?
											'version-tab tab selected-version-tab' : 'version-tab tab'}
											onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
										/>);
									})}
								</div>

								<div className="context-tabs tabs" />

							</article>
						:

							<article className="comment lemma-comment paper-shadow">
								<p className="lemma-text no-lines-selected">No line(s) selected</p>
							</article>
					}

				</div>
			</div>
		);
	}
}
CommentLemmaSelect.propTypes = {
	work: PropTypes.string.isRequired,
	subworkN: PropTypes.number.isRequired,
	lineFrom: PropTypes.number.isRequired,
	lineTo: PropTypes.number.isRequired,
	textNodes: PropTypes.array,
	editionsQuery: PropTypes.object,
	updateQuery: PropTypes.func,
	shouldUpdateQuery: PropTypes.bool
};

export default compose(
	editionsQuery
)(CommentLemmaSelect);
