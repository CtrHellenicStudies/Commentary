import React, { Component, PropTypes } from 'react';
import { compose } from 'react-apollo';
import Utils from '../../../../lib/utils';

// components
import FilterWidget from '../../../filters/components/FilterWidget/FilterWidget';
import ContextPanel from '../../../contextPanel/components/ContextPanel/ContextPanel';
import CommentLemmaSelect from '../../components/CommentLemmaSelect/CommentLemmaSelect';
import AddComment from '../../components/AddComment/AddComment';

// graphql
import textNodesQuery from '../../../textNodes/graphql/queries/textNodesQuery';

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
            textNodes: props.textNodesQuery.loading ? [] : props.textNodesQuery.textNodes
        });
    }
    render() {

		const { selectedLineFrom, selectedLineTo, contextReaderOpen, textNodes } = this.state;
        const { filters, textNodesUrn, updateSelectedLines, selectedTextNodes } = this.props;
        const { work, lineFrom } = getFilterValues(filters);
		Utils.setTitle('Add Comment | The Center for Hellenic Studies Commentaries');

		return (
                <main>
                    <div className="commentary-comments">
                        <div className="comment-group">
                            <CommentLemmaSelect
                                //textNodes={selectedTextNodes}
                            />

                            <AddComment
                                selectedLineFrom={selectedLineFrom}
                                selectedLineTo={selectedLineTo}
                                submitForm={this.addComment}
                                work={work}
                            />
                        </div>
                        <ContextPanel
                            open={contextReaderOpen}
                            filters={filters}
                            selectedLineFrom={selectedLineFrom}
                            selectedLineTo={selectedLineTo}
                            updateSelectedLines={updateSelectedLines}
                            textNodes={textNodes}
                            textNodesUrn={textNodesUrn}
                            editor
                        />
                    </div>

                    <FilterWidget
                        filters={filters}
                        toggleSearchTerm={this.toggleSearchTerm}
                    />
                </main>
		);
	}
}
AddCommentContainer.props = {
    selectedTextNodes: PropTypes.object,
    textNodesQuery: PropTypes.func
};
export default compose(textNodesQuery)(AddCommentContainer);