import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import moment from 'moment';
import CopyToClipboard from 'react-copy-to-clipboard';
import Utils from '../../../../../lib/utils';
import FlatButton from 'material-ui/FlatButton';

import { sortRevisions, getRevisionDate } from './helpers';

class CommentCitation extends Component {

	constructor(props) {
		super(props);

		this.state = {
			openMenu: false,
			anchorEl: null,
			copied: false,
		};
	}

	handleTouchTap(event) {
		// This prevents ghost click.
		event.preventDefault();

		this.setState({
			openMenu: true,
			anchorEl: event.currentTarget,
		});
	}

	handleRequestClose() {
		this.setState({
			openMenu: false,
		});
	}

	render() {

		const { comment } = this.props;
		const { openMenu } = this.state;

		if (!comment) {
			return null;
		}
		const urn = Utils.resolveUrn(comment.urn);

		const actions = [
			<FlatButton
				label="Cancel"
				onTouchTap={this.handleRequestClose.bind(this)}
			/>,
		];


		return (
			<div className="comment-citation">
				<RaisedButton
					label="Cite this comment"
					labelPosition="after"
					onClick={this.handleTouchTap.bind(this)}
				/>
				<Dialog
					open={openMenu}
					title="Cite this comment"
					onRequestClose={this.handleRequestClose.bind(this)}
					actions={actions}
					autoScrollBodyContent
				>
					<p className="comment-citation-help">
						You may cite this comment's revisions with the URNs below:
					</p>
					<div className="comment-citation-urns">
						{sortRevisions(comment.revisions).map((revision, i) => {
							const updated = getRevisionDate(revision);
							return (
								<div
									key={`${updated}-${i}`}
									className="comment-citation-urn"
								>
									<label>
										Revision {moment(updated).format('D MMMM YYYY')}
									</label>
									<span className="urn">
										<a //TODO
											href={`//nrs.${Utils.getEnvDomain()}/v2/${urn}.${comment.revisions.length - i - 1}/${comment._id}`}
										>
											nrs.chs.harvard.edu/v2/{urn}.{comment.revisions.length - i - 1}
										</a>
									</span>
									<CopyToClipboard
										text={`https://nrs.${Utils.getEnvDomain()}/v2/${urn}.${comment.revisions.length - i - 1}`}
										onCopy={() => this.setState({copied: true})}
									>
										<span className="copy-to-clipboard">
											Copy to clipboard
										</span>
									</CopyToClipboard>
								</div>
							);
						})}
					</div>
				</Dialog>
			</div>
		);
	}
}

CommentCitation.propTypes = {
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
};

export default CommentCitation;
