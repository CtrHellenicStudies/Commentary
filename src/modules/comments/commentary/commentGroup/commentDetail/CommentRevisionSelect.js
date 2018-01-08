import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import FlatButton from 'material-ui/FlatButton';

// components
import CommentCitation from './CommentCitation';

// helpers
import { sortRevisions, getRevisionDate } from './helpers';


class CommentRevisionSelect extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showMoreRevisions: false
		};

		this.getClassName = this.getClassName.bind(this);
		this.toggleMoreRevisions = this.toggleMoreRevisions.bind(this);
	}

	getClassName(selectedRevisionIndex, i) {
		return `revision ${selectedRevisionIndex === i ? 'selected-revision' : ''}`;
	}

	toggleMoreRevisions() {
		const { showMoreRevisions } = this.state;

		this.setState({
			showMoreRevisions: !showMoreRevisions
		});
	}


	render() {
		const { showMoreRevisions } = this.state;
		const { comment, selectedRevisionIndex, selectRevision } = this.props;
		const revisions = comment ? sortRevisions(comment.revisions) : [];
		const fullRevisionsList = revisions;
		const truncatedRevisionsList = fullRevisionsList.slice(0, 3);

		return (
			<div className="comment-revisions">
				{ showMoreRevisions ?
					fullRevisionsList.map((revision, i) => {
						const updated = getRevisionDate(revision);
						return (
							<FlatButton
								key={revision._id || i}
								id={i}
								data-id={revision._id}
								className={this.getClassName(selectedRevisionIndex, i)}
								onClick={selectRevision}
								label={`Revision ${moment(updated).format('D MMMM YYYY')}`}
							/>
						);
					})
					:
					truncatedRevisionsList.map((revision, i) => {
						const updated = getRevisionDate(revision);
						return (
							<FlatButton
								key={revision._id || i}
								id={i}
								data-id={revision._id}
								className={this.getClassName(selectedRevisionIndex, i)}
								onClick={selectRevision}
								label={`Revision ${moment(updated).format('D MMMM YYYY')}`}
							/>
						);
					})
				}
				{ truncatedRevisionsList.length < fullRevisionsList.length ?
					<FlatButton
						className="revision"
						label={this.state.showMoreRevisions ? 'Hide Older Revisions' : 'Show More Revisions'}
						onClick={this.toggleMoreRevisions}
					/>
					:
					''
				}
				<CommentCitation
					comment={comment}
				/>
			</div>
		);
	}
}

CommentRevisionSelect.propTypes = {
	comment: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		revisions: PropTypes.arrayOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
			created: PropTypes.instanceOf(Date),
			updated: PropTypes.instanceOf(Date),
			originalDate: PropTypes.instanceOf(Date),
		})).isRequired,
		urn: PropTypes.object.isRequired,
	}),
	selectedRevisionIndex: PropTypes.number.isRequired,
	selectRevision: PropTypes.func.isRequired,
};


export default CommentRevisionSelect;
