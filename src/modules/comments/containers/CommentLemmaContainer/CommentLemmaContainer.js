import React from 'react';
import { compose } from 'react-apollo';
import autoBind from 'react-autobind';

// graphql
import { textNodesQuery } from '../../../../graphql/methods/textNodes';
import { editionsQuery } from '../../../../graphql/methods/editions';
// import { translationsQuery } from '../../../../graphql/methods/translations';

// components
import CommentLemma from '../../components/CommentLemma';
import LoadingLemma from '../../../../components/loading/LoadingLemma';

// lib
import parseCommentsToCommentGroups from '../../lib/parseCommentsToCommentGroups';
import Utils from '../../../../lib/utils';


class CommentLemmaContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedLemmaEditionIndex: 0,
		};

		autoBind(this);
	}

	toggleEdition(editionSlug) {
		const { editions } = this.state;
		const { selectedLemmaEditionIndex } = this.state;
		let selectedLemmaEdition = this.state.selectedLemmaEdition;

		if (editions && editions.length) {
			if (editions[selectedLemmaEditionIndex].slug !== editionSlug) {
				let newSelectedEditionIndex = 0;

				editions.forEach((edition, index) => {
					if (edition.slug === editionSlug) {
						newSelectedEditionIndex = index;
						selectedLemmaEdition = edition;
					}
				});

				this.setState({
					selectedLemmaEditionIndex: newSelectedEditionIndex,
					selectedLemmaEdition: selectedLemmaEdition
				});
			}
		}
	}

  render() {
		const { commentGroup, multiline } = this.props;
		const { selectedLemmaEditionIndex } = this.state;
		let translationAuthors = [];

		if (this.props.textNodesQuery.loading
			|| this.props.editionsQuery.loading
			// || this.props.translationsQuery.loading
		) {
			return <LoadingLemma />
		}

		// text nodes data
		const textNodes = this.props.textNodesQuery.textNodes;

		// set editions from textnodes data
		let editions = Utils.textFromTextNodesGroupedByEdition(
			textNodes,
			this.props.editionsQuery.works,
		);

		// if necessary, parse editions into multiline data
		editions = multiline ?
			Utils.parseMultilineEdition(editions, multiline)
			:
			editions;
		const selectedLemmaEdition = (editions.length && editions[selectedLemmaEditionIndex].textNodes) ?
			editions[selectedLemmaEditionIndex]
			:
			{ textNodes: [] };


    return (
      <CommentLemma
				commentGroup={commentGroup}
				editions={editions}
				translationAuthors={translationAuthors}
        selectedLemmaEdition={selectedLemmaEdition}
				showContextPanel={this.props.showContextPanel}
				index={this.props.index}
				setScrollPosition={this.props.setScrollPosition}
				hideLemma={this.props.hideLemma}
				selectMultiLine={this.props.selectMultiLine}
				multiline={this.props.multiline}
      />
    );
  }
}

export default compose(
	editionsQuery,
	textNodesQuery,
	// translationsQuery // TODO: readd translations
)(CommentLemmaContainer);
