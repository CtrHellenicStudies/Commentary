import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Dialog from 'material-ui/Dialog';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import ContentLink from 'material-ui/svg-icons/content/link';
import Utils from '/imports/lib/utils';

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


		return (
			<div className="comment-citation">
				<RaisedButton
					label="Cite this comment"
					labelPosition="after"
					onClick={this.handleTouchTap.bind(this)}
				/>
				<Dialog
					open={openMenu}
					modal
					title="Cite this comment"
					onRequestClose={this.handleRequestClose.bind(this)}
					autoScrollBodyContent
				>

					<Menu>
						{sortRevisions(comment.revisions).reverse().map((revision, i) => {

							const updated = getDateRevision(revision);

							return (
								<MenuItem
									key={revision._id}
									href={`//nrs.${Utils.getEnvDomain()}/v1/${comment.urn}.${comment.revisions.length - i - 1}`}
									primaryText={`Revision ${moment(updated).format('D MMMM YYYY')}`}
									style={styles.menuItem}
									leftIcon={<ContentLink />}
								/>
							);
						})}
					</Menu>
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
