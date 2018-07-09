import React, { Component } from 'react';
import { compose } from 'react-apollo';

// graphql
import textNodesQuery from '../../../textNodes/graphql/queries/textNodesQuery';

// components
import CommentLemmaSelect from '../../../comments/components/CommentLemmaSelect/CommentLemmaSelect';
import AddKeyword from '../../components/AddKeyword/AddKeyword';
import ContextPanel from '../../../contextPanel/components/ContextPanel/ContextPanel';


class AddKeywordContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			textNodes: [],
			selectedTextNodes: []
		};
		this.updateSelectedLemma = this.updateSelectedLemma.bind(this);
	}
	updateSelectedLemma(_textNodes) {
		this.setState({selectedTextNodes : [_textNodes]});
	}
	componentWillReceiveProps(props) {
		this.setState({
			textNodes: props.textNodesQuery.loading ? [] : props.textNodesQuery.textNodes
		});
	}
	render() {
		const { work, textNodesUrn, addKeyword } = this.props;
		const { textNodes, selectedTextNodes } = this.state;

		let lineFrom;
		return(
			<div className="commentary-comments">
				<div className="comment-group">
					<CommentLemmaSelect
						textNodes={selectedTextNodes}
					/>
					<AddKeyword
						selectedLineFrom={this.state.selectedLineFrom}
						selectedLineTo={this.state.selectedLineTo}
						submitForm={addKeyword}
						onTypeChange={this.onTypeChange}
					/>
					<ContextPanel
						open={this.state.contextReaderOpen}
						workSlug={work ? work : 'tlg001'}
						lineFrom={lineFrom || 1}
						selectedLineFrom={this.state.selectedLineFrom}
						selectedLineTo={this.state.selectedLineTo}
						updateSelectedLemma={this.updateSelectedLemma}
						textNodesUrn={textNodesUrn}
						textNodes={textNodes}
						editor
					/>
				</div>
			</div>
		);
	}
}
export default compose(textNodesQuery)(AddKeywordContainer);
