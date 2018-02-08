import React, { Component } from 'react';
import { compose } from 'react-apollo';

// graphql
import commentsQuery from '../../../comments/graphql/queries/comments';

// components
import CommentLemmaSelect from '../../../comments/components/CommentLemmaSelect/CommentLemmaSelect';
import AddKeyword from '../../components/AddKeyword/AddKeyword';
import ContextPanel from '../../../contextPanel/components/ContextPanel/ContextPanel';

// lib
import Utils from '../../../../lib/utils';


const AddKeywordContainer = class AddKeywordContainerClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textNodes: [],
            selectedTextNodes: []
        };
    }
    updateSelectedLines(selectedLineFrom, selectedLineTo) {
		const { textNodes } = this.state;
		let finalFrom = 0, finalTo = 0;
		if (selectedLineFrom === null) {
			this.setState({
				selectedLineTo,
			});
			finalFrom = 0;
			finalTo = selectedLineTo;
		} else if (selectedLineTo === null || selectedLineFrom > selectedLineTo) {
			this.setState({
				selectedLineFrom: selectedLineFrom - 1,
				selectedLineTo: selectedLineFrom
			});
			finalFrom = selectedLineFrom - 1;
			finalTo = selectedLineFrom;
		} else if (selectedLineTo != null && selectedLineFrom != null) {
			this.setState({
				selectedLineFrom,
				selectedLineTo,
			});
			finalFrom = selectedLineFrom;
			finalTo = selectedLineTo;
		} else {
			return;
		}
		this.setState({
			selectedTextNodes: Utils.filterTextNodesBySelectedLines(textNodes, finalFrom, finalTo)
		});
	}
    componentWillReceiveProps(props) {
        this.setState({
            textNodes: props.textNodesQuery.loading ? [] : props.textNodesQuery.textNodes
        });
    }
    render() {
        const { work, textNodesUrn } = this.props;
        const { textNodes, selectedTextNodes } = this.state;

        let lineFrom;
        return(
            <div className="commentary-comments">
                <div className="comment-group">
                    <CommentLemmaSelect
                        ref={(component) => { this.commentLemmaSelect = component; }}
                        lineFrom={this.state.selectedLineFrom}
                        lineTo={this.state.selectedLineTo}
                        workSlug={work}
                        shouldUpdateQuery={this.state.updateQuery}
                        updateQuery={this.updateQuery}
                        textNodes={selectedTextNodes}				
                    />
                    <AddKeyword
                        selectedLineFrom={this.state.selectedLineFrom}
                        selectedLineTo={this.state.selectedLineTo}
                        submitForm={this.addKeyword}
                        onTypeChange={this.onTypeChange}
                    />
                    <ContextPanel
                        open={this.state.contextReaderOpen}
                        workSlug={work ? work : 'tlg001'}
                        lineFrom={lineFrom || 1}
                        selectedLineFrom={this.state.selectedLineFrom}
                        selectedLineTo={this.state.selectedLineTo}
                        updateSelectedLines={this.updateSelectedLines}
                        textNodesUrn={textNodesUrn}
                        textNodes={textNodes}
                        editor
                    />
                </div>
            </div>
        );
    }
}
export default compose(commentsQuery)(AddKeywordContainer);
