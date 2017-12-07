import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { compose } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

// graphql
import { editionsQuery } from '/imports/graphql/methods/editions';
import { textNodesQuery } from '/imports/graphql/methods/textNodes';

// lib:
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';


class CommentLemmaSelect extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedLemmaEdition: '',
			lineLetterValue: '',
		};
		this.onLineLetterValueChange = this.onLineLetterValueChange.bind(this);
		this.toggleEdition = this.toggleEdition.bind(this);
		const { selectedLineFrom, selectedLineTo, workSlug, subworkN } = this.props;
		const properties = {
			tenantId: sessionStorage.getItem('tenantId'),
			workSlug: workSlug,
			subworkN: subworkN,
			lineFrom: selectedLineFrom,
			lineTo: selectedLineFrom <= selectedLineTo ? selectedLineTo : selectedLineFrom
		};

		props.textNodesQuery.refetch(properties);
	}
	componentWillReceiveProps(nextProps) {

		const textNodesCursor = nextProps.textNodesQuery.loading ? [] : nextProps.textNodesQuery.textNodes;
		
		const editions = !nextProps.editionsQuery.loading ?
			Utils.textFromTextNodesGroupedByEdition(textNodesCursor, nextProps.editionsQuery.editions) : [];

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

					{this.props.selectedLineFrom > 0 &&
						this.state.selectedLemmaEdition &&
						'lines' in this.state.selectedLemmaEdition ?
							<article className="comment lemma-comment paper-shadow">

								{this.state.selectedLemmaEdition.lines.map((line, i) => (
									<p
										key={i}
										className="lemma-text"
										dangerouslySetInnerHTML={{ __html: line.html }}
									/>
							))}

								{self.props.selectedLineTo === 0 ?
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

								<div className="edition-tabs tabs">
									{this.state.lemmaText.map((lemmaTextEdition, i) => {
										const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

										return (<RaisedButton
											key={i}
											label={lemmaEditionTitle}
											data-edition={lemmaTextEdition.title}
											className={self.state.selectedLemmaEdition.slug === lemmaTextEdition.slug ?
											'edition-tab tab selected-edition-tab' : 'edition-tab tab'}
											onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
										/>);
									})}
								</div>

								<div className="context-tabs tabs">

								</div>

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
	workSlug: PropTypes.string.isRequired,
	subworkN: PropTypes.number.isRequired,
	selectedLineFrom: PropTypes.number.isRequired,
	selectedLineTo: PropTypes.number.isRequired,
	textNodesQuery: PropTypes.object,
	editionsQuery: PropTypes.object
};

export default compose(
	editionsQuery,
	textNodesQuery
)(CommentLemmaSelect);
