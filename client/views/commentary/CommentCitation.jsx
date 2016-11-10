import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
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
		};
	},

	handleOnRequestChange(value) {
		this.setState({
			openMenu: value,
		});
	},

	iconButtonMenuElement(label) {
		return (
			<RaisedButton
				label={label}
				labelPosition="after"
			/>
		);
	},

	render() {
		const comment = this.props.comment;
		const title = this.props.title;
		const componentClass = this.props.componentClass;

		return (
			<div className={componentClass}>
				<IconMenu
					iconButtonElement={this.iconButtonMenuElement(title)}
					open={this.state.openMenu}
					onRequestChange={this.handleOnRequestChange}
					anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
					targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
				>
					{comment.revisions.map((revision, i) => (
						<MenuItem
							key={i}
							href={`/commentary/?_id=${comment._id}&revision=${i}`}
							primaryText={`Revision ${moment(revision.created).format('D MMMM YYYY')}`}
						/>
					))}
					<MenuItem href={`/commentary/?_id=${comment._id}`} primaryText="Comment link" />
				</IconMenu>
			</div>
		);
	},
});
