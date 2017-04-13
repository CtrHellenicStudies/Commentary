import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

const getDateRevision = (revision) => {
	if (revision.originalDate) return revision.originalDate;
	return revision.updated;
};

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

		const { commentId, revisions } = this.props;
		const { openMenu, anchorEl } = this.state;

		return (
			<div className="comment-citation">
				<RaisedButton
					label="Cite this comment"
					labelPosition="after"
					onTouchTap={this.handleTouchTap.bind(this)}
				/>
				<Popover
					open={openMenu}
					anchorEl={anchorEl}
					anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
					targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
					onRequestClose={this.handleRequestClose.bind(this)}
				>
					<Menu>
						{revisions.map((revision, i) => {

							const updated = getDateRevision(revision);

							return (
								<MenuItem
									key={revision.id}
									href={`/commentary/?_id=${commentId}&revision=${i}`}
									primaryText={`Revision ${moment(updated).format('D MMMM YYYY')}`}
								/>
							);
						})}
						<MenuItem href={`/commentary/?_id=${commentId}`} primaryText="Comment link" />
					</Menu>
				</Popover>
			</div>
		);
	}
}
CommentCitation.propTypes = {
	commentId: React.PropTypes.string.isRequired,
	revisions: React.PropTypes.arrayOf(React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		updated: React.PropTypes.instanceOf(Date).isRequired,
		originalDate: React.PropTypes.instanceOf(Date),
	})).isRequired,
};

export default CommentCitation;
