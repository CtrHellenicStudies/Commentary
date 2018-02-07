import React, { Component } from 'react';
import { compose } from 'react-apollo';
import Utils from '../../../../lib/utils';

// components
import FilterWidget from '../../../filters/FilterWidget';
import ContextPanel from '../../../contextPanel/ContextPanel';
import CommentLemmaSelect from '../../components/CommentLemmaSelect/CommentLemmaSelect';
import AddComment from '../../components/AddComment/AddComment';

// graphql
import { textNodesQuery } from '../../../../graphql/methods/textNodes';

const getFilterValues = (filters) => {
	const filterValues = {};

	filters.forEach((filter) => {
		if (filter.key === 'works') {
			filterValues.work = filter.values[0];
		} else if (filter.key === 'lineTo') {
			filterValues.lineTo = filter.values[0];
		} else if (filter.key === 'lineFrom') {
			filterValues.lineFrom = filter.values[0];
		}
	});

	return filterValues;
};

const AddCommentContainer = class AddCommentContainerClass extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillReceiveProps(props) {
        this.setState({
            textNodes: this.props.textNodesQuery.loading ? [] : this.props.textNodesQuery.textNodes
        });
    }
    render() {

		const { selectedLineFrom, selectedLineTo, contextReaderOpen, selectedTextNodes, textNodes } = this.state;
        const { filters, textNodesUrn } = this.props;
        const { work, lineFrom } = getFilterValues(filters);

		Utils.setTitle('Add Comment | The Center for Hellenic Studies Commentaries');

		return (
                <main>
                    <div className="commentary-comments">
                        <div className="comment-group">
                            <CommentLemmaSelect
                                ref={(component) => { this.commentLemmaSelect = component; }}
                                lineFrom={selectedLineFrom}
                                lineTo={selectedLineTo}
                                work={work ? work : 'tlg0013'}
                                shouldUpdateQuery={this.state.updateQuery}
                                updateQuery={this.updateQuery}
                                textNodes={selectedTextNodes}

                            />

                            <AddComment
                                selectedLineFrom={selectedLineFrom}
                                selectedLineTo={selectedLineTo}
                                submitForm={this.addComment}
                                work={work}
                            />

                            <ContextPanel
                                open={contextReaderOpen}
                                workSlug={work ? work.slug : '001'}
                                lineFrom={lineFrom || 1}
                                filters={filters}
                                selectedLineFrom={selectedLineFrom}
                                selectedLineTo={selectedLineTo}
                                updateSelectedLines={this.updateSelectedLines}
                                textNodes={textNodes}
                                textNodesUrn={textNodesUrn}
                                editor
                            />
                        </div>
                    </div>

                    <FilterWidget
                        filters={filters}
                        toggleSearchTerm={this.toggleSearchTerm}
                    />
                </main>
		);
	}
}

export default compose(textNodesQuery)(AddCommentContainer);