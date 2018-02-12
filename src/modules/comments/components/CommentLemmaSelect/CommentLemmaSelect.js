import React, { Component, PropTypes } from 'react';
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
		const editions = nextProps.textNodes;

		this.setState({
		//	lemmaText: editions,
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
		return (<div></div>
		);
	}
}
CommentLemmaSelect.propTypes = {
	textNodes: PropTypes.array,
	editionsQuery: PropTypes.func
};

export default compose(
	editionsQuery
)(CommentLemmaSelect);
