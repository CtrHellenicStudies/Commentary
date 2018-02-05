import React from 'react';
import { compose } from 'react-apollo';
import autoBind from 'react-autobind';

// graphql
import { textNodesQuery } from '../../../../graphql/methods/textNodes';

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
			selectedLemmaVersionIndex: 0,
			selectedTranslationVersionIndex: null,
		};

		autoBind(this);
	}

	toggleVersion(versionId) {
		const { versions } = this.state;
		const { selectedLemmaVersionIndex } = this.state;
		let selectedLemmaVersion = this.state.selectedLemmaVersion;

		if (versions && versions.length) {
			if (versions[selectedLemmaVersionIndex].id !== versionId) {
				let newSelectedVersionIndex = 0;

				versions.forEach((version, index) => {
					if (version.id === versionId) {
						newSelectedVersionIndex = index;
						selectedLemmaVersion = version;
					}
				});

				this.setState({
					selectedLemmaVersionIndex: newSelectedVersionIndex,
					selectedLemmaVersion: selectedLemmaVersion
				});
			}
		}
	}

  render() {
		const { commentGroup, multiline } = this.props;
		const { selectedLemmaVersionIndex, selectedTranslationVersionIndex } = this.state;
		let textNodes = [];
		let works = [];
		let versionsWithText = [];
		let translationsWithText = [];
		let selectedLemmaVersion = { textNodes: [] };
		let selectedTranslationVersion = { textNodes: [] };

		if (this.props.textNodesQuery.loading) {
			return <LoadingLemma />
		}

		// text nodes data
		if (
			this.props.textNodesQuery
			&& this.props.textNodesQuery.textNodes
		) {
			textNodes = this.props.textNodesQuery.textNodes;
		}

		// TODO: potentially structure data from backend to prevent this transformation
		// in the future
		// set versions from textnodes data
		if (textNodes && textNodes.length) {
			const allVersions = Utils.textFromTextNodesGroupedByVersion(textNodes);
			versionsWithText = allVersions.versions;
			translationsWithText = allVersions.translations;
		}

		// if necessary, parse versions into multiline data
		versionsWithText = multiline ?
			Utils.parseMultilineVersion(versionsWithText, multiline)
			:
			versionsWithText;

		// set selected version
		if (
			versionsWithText.length
			&& versionsWithText[selectedLemmaVersionIndex]
		) {
			selectedLemmaVersion = versionsWithText[selectedLemmaVersionIndex];
		}



    return (
      <CommentLemma
				commentGroup={commentGroup}
				versions={versionsWithText}
				translations={translationsWithText}
        selectedLemmaVersion={selectedLemmaVersion}
				selectedTranslationVersion={selectedTranslationVersion}
				showContextPanel={this.props.showContextPanel}
				index={this.props.index}
				setScrollPosition={this.props.setScrollPosition}
				hideLemma={this.props.hideLemma}
				selectMultiLine={this.props.selectMultiLine}
				multiline={this.props.multiline}
				toggleVersion={this.toggleVersion}
      />
    );
  }
}

export default compose(
	textNodesQuery,
)(CommentLemmaContainer);
