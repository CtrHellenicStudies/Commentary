import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// graphql
import textNodesQuery from '../../../textNodes/graphql/queries/textNodesQuery';
import commentersQuery from '../../../commenters/graphql/queries/commentersQuery';
import keywordsQuery from '../../graphql/queries/list';

// components
import CommentLemmaSelect from '../../../comments/components/CommentLemmaSelect';
import AddKeyword from '../../components/AddKeyword';
import ContextPanel from '../../../contextPanel/components/ContextPanel';


class AddKeywordContainer extends React.Component {
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

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});


export default compose(
	commentersQuery,
	keywordsQuery,
	textNodesQuery,
	connect(mapStateToProps),
)(AddKeywordContainer);
