import React from 'react';
import { compose } from 'react-apollo';
import autoBind from 'react-autobind';

// graphql
import textNodesQuery from '../../../textNodes/graphql/queries/textNodesQuery';

// components
import CommentLemma from '../../components/CommentLemma';
import LoadingLemma from '../../../../components/loading/LoadingLemma';

// lib
import Utils from '../../../../lib/utils';
import getCurrentSubdomain from '../../../../lib/getCurrentSubdomain';
import defaultWorksEditions from '../../lib/defaultWorksEditions';


class CommentLemmaContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedLemmaVersionIndex: null,
			selectedTranslationVersionIndex: null,
		};

		autoBind(this);
	}

	toggleVersion(versionId) {
		const { selectedLemmaVersionIndex } = this.state;
		let textNodes = [];
		let versions = [];

		if (
			this.props.textNodesQuery
			&& this.props.textNodesQuery.textNodes
		) {
			textNodes = this.props.textNodesQuery.textNodes;
		}

		if (textNodes && textNodes.length) {
			const allVersions = Utils.textFromTextNodesGroupedByVersion(textNodes);
			versions = allVersions.versions;
		}

		if (versions && versions.length) {
			if (
				selectedLemmaVersionIndex === null
				|| versions[selectedLemmaVersionIndex].id !== versionId
			) {
				let newSelectedVersionIndex = 0;

				versions.forEach((version, index) => {
					if (version.id === versionId) {
						newSelectedVersionIndex = index;
					}
				});

				this.setState({
					selectedLemmaVersionIndex: newSelectedVersionIndex,
				});
			}
		}
	}

	render() {
		const { commentGroup, multiline } = this.props;
		const { selectedLemmaVersionIndex } = this.state;
		const subdomain = getCurrentSubdomain();
		let textNodes = [];
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
		if (versionsWithText.length) {
			if (
				selectedLemmaVersionIndex !== null
				&& versionsWithText[selectedLemmaVersionIndex]
			) {
				selectedLemmaVersion = versionsWithText[selectedLemmaVersionIndex];
			} else {
				selectedLemmaVersion = versionsWithText.find(version => (version.urn === defaultWorksEditions[subdomain].defaultVersionUrn));
			}
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
				lemmaCitation={this.props.lemmaCitation}
			/>
		);
	}
}
export default compose(
	textNodesQuery,
)(CommentLemmaContainer);
