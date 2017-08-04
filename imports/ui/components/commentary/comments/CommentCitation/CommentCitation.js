import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Dialog from 'material-ui/Dialog';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import CopyToClipboard from 'react-copy-to-clipboard';
import Utils from '/imports/lib/utils';
import FlatButton from 'material-ui/FlatButton';

const getDateRevision = (revision) => {
	if (revision.originalDate) return revision.originalDate;
	else if (revision.updated) return revision.updated;
	return revision.created;
};

const sortRevisions = revisions => (_.sortBy(revisions, 'created'));

class CommentCitation extends React.Component {

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
		const { openMenu, anchorEl } = this.state;

		if (!comment) {
			return null;
		}

		const styles = {
			menuItem: {
				fontFamily: 'ProximaNW01-AltLightReg',
			}
		};

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
						{sortRevisions(comment.revisions).reverse().map((revision, i) => {
							const updated = getDateRevision(revision);
							return (
								<div
									key={`${updated}-${i}`}
									className="comment-citation-urn"
								>
									<label>
										Revision {moment(updated).format('D MMMM YYYY')}
									</label>
									<span className="urn">
										<a
											href={`//nrs.${Utils.getEnvDomain()}/v1/${comment.urn}.${comment.revisions.length - i - 1}`}
										>
											nrs.chs.harvard.edu/v1/{comment.urn}.{comment.revisions.length - i - 1}
										</a>
									</span>
									<CopyToClipboard
										text={`https://nrs.${Utils.getEnvDomain()}/v1/${comment.urn}.${comment.revisions.length - i - 1}`}
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
};

export default CommentCitation;
