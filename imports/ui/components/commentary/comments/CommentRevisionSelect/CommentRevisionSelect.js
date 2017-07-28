import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import CommentCitation from '/imports/ui/components/commentary/comments/CommentCitation';

import moment from 'moment';


class CommentRevisionSelect extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showMoreRevisions: false
		};

		this.getDateRevision = this.getDateRevision.bind(this);
		this.getClassName = this.getClassName.bind(this);
		this.sortRevisions = this.sortRevisions.bind(this);
		this.toggleMoreRevisions = this.toggleMoreRevisions.bind(this);
	}

	static propTypes = {
		comment: React.PropTypes.shape({
			_id: React.PropTypes.string.isRequired,
			revisions: React.PropTypes.arrayOf(React.PropTypes.shape({
				_id: React.PropTypes.string.isRequired,
				created: React.PropTypes.instanceOf(Date),
				updated: React.PropTypes.instanceOf(Date),
				originalDate: React.PropTypes.instanceOf(Date),
			})).isRequired,
			urn: React.PropTypes.string.isRequired,
		}),
		selectedRevisionIndex: React.PropTypes.number.isRequired,
		selectRevision: React.PropTypes.func.isRequired,
		isTest: React.PropTypes.bool,
	}

	getDateRevision(revision) {
		if (revision.originalDate) return revision.originalDate;
		else if (revision.updated) return revision.updated;
		return revision.created;
	}

	getClassName(selectedRevisionIndex, i) {
		return `revision ${selectedRevisionIndex === i ? 'selected-revision' : ''}`;
	}

	sortRevisions(revisions) {
		return _.sortBy(revisions, 'created').reverse();
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

		const fullRevisionsList = this.sortRevisions(comment.revisions);
		const truncatedRevisionsList = this.sortRevisions(comment.revisions).slice(0, 3);
		
		return (
			<div className="comment-revisions">
				{ showMoreRevisions ?
					fullRevisionsList.map((revision, i) => {
						const updated = this.getDateRevision(revision);
						return (
							<FlatButton
								key={revision._id}
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
						const updated = this.getDateRevision(revision);
						return (
							<FlatButton
								key={revision._id}
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
						className={'revision'}
						label={'Show More Revisions'}
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

export default CommentRevisionSelect;
