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
        									let iconStyle = {
                																				width: 36,
                																				height: 36,
            										},
            										style = {
                										width: 72,
                										height: 72,
                										padding: 16,
            };
        										return (
            <RaisedButton
	label={label}
	labelPosition="after"
            />
        );
    },

    										render() {
        									let comment = this.props.comment,
            										title = this.props.title,
            										componentClass = this.props.componentClass;

        										return (
            <div className={componentClass}>
                <IconMenu
	iconButtonElement={this.iconButtonMenuElement(title)}
	open={this.state.openMenu}
	onRequestChange={this.handleOnRequestChange}
	anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
	targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                >
                    {comment.revisions.map(function (revision, i) {
                        										return (<MenuItem
	key={i}
	primaryText={'Revision ' + moment(revision.created).format('D MMMM YYYY')}
                                 />);
                    })}
                    <MenuItem href={'/commentary/?_id=' + comment._id} primaryText="Comment link" />
                </IconMenu>
            </div>
            );
    },
});
