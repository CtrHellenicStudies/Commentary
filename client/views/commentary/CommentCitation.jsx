import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

CommentCitation = React.createClass({

	propTypes: {
		componentClass: React.PropTypes.string,
		title: React.PropTypes.string,
		comment: React.PropTypes.object,
	},

	getInitialState() {
		return {
			openMenu: false,
			anchorEl: null,
		};
	},

	handleTouchTap(event) {
		// This prevents ghost click.
		event.preventDefault();

		this.setState({
			openMenu: true,
			anchorEl: event.currentTarget,
		});
	},

	handleRequestClose() {
		this.setState({
			openMenu: false,
		});
	},

	render() {
		const comment = this.props.comment;
		const title = this.props.title;
		const componentClass = this.props.componentClass;

		return (
			<div className={componentClass}>
				<RaisedButton
					label={title}
					labelPosition="after"
					onTouchTap={this.handleTouchTap}
				/>
				<Popover
					open={this.state.openMenu}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
					targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
					onRequestClose={this.handleRequestClose}
				>
					<Menu>
						{comment.revisions.map((revision, i) => (
							<MenuItem
								key={i}
								href={`/commentary/?_id=${comment._id}&revision=${i}`}
								primaryText={`Revision ${moment(revision.created).format('D MMMM YYYY')}`}
							/>
						))}
						<MenuItem href={`/commentary/?_id=${comment._id}`} primaryText="Comment link" />
					</Menu>
				</Popover>
			</div>
		);
	},
});
