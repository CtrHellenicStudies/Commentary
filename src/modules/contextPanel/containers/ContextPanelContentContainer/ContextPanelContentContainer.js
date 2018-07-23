import React from 'react';
import { compose } from 'react-apollo';
import autoBind from 'react-autobind';

// graphql
import textNodesQuery from '../../../textNodes/graphql/queries/textNodesQuery';
import { editionsQuery } from '../../../textNodes/graphql/queries/editions';

// component
import ContextPanelContent from '../../components/ContextPanelContent';

// lib
import Utils from '../../../../lib/utils';
import getCurrentSubdomain from '../../../../lib/getCurrentSubdomain';
import defaultWorksEditions from '../../../comments/lib/defaultWorksEditions';


class ContextPanelContentContainer extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedLemmaVersionIndex: null,
			highlightingVisible: false,
		};

		// methods:
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

	toggleHighlighting() {
		this.setState({
			highlightingVisible: !this.state.highlightingVisible,
		});
	}

	render() {
		const { highlightingVisible, selectedLemmaVersionIndex } = this.state;
		const subdomain = getCurrentSubdomain();
		let textNodes = [];
		let versionsWithText = [];
		let selectedLemmaVersion = null;
		let multiline = false;

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
			<ContextPanelContent
				{...this.props}
				selectedLemmaVersion={selectedLemmaVersion}
				highlightingVisible={highlightingVisible}
				versions={versionsWithText}
				toggleVersion={this.toggleVersion}
				toggleHighlighting={this.toggleHighlighting}
			/>
		);
	}
}


export default compose(
	textNodesQuery,
	editionsQuery,
)(ContextPanelContentContainer);
