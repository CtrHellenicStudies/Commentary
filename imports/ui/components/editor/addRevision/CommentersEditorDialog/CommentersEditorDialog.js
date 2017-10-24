import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import { grey400 } from 'material-ui/styles/colors';
import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import Cookies from 'js-cookie';
import { createContainer } from 'meteor/react-meteor-data';
import Select from 'react-select';
import AutoComplete from 'material-ui/AutoComplete';
import Person from 'material-ui/svg-icons/social/person';

import Commenters from '/imports/models/commenters';

class CommentersEditorDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			commenters: this.props.currentCommenters,
			searchText: ''
		};
		this.deleteCommenter = this.deleteCommenter.bind(this);
		this.selectCommenter = this.selectCommenter.bind(this);
		this.changeSearchTextValue = this.changeSearchTextValue.bind(this);
	}

	deleteCommenter(index) {
		const currentCommenters = this.state.commenters;
		currentCommenters.splice(index, 1);

		this.props.setCommenters(currentCommenters);
	}

	changeSearchTextValue(value) {
		this.setState({
			searchText: value
		});
	}

	selectCommenter(commenter) {
		if (commenter.name) {
			const currentCommenters = this.state.commenters;
			currentCommenters.push(commenter);

			this.props.setCommenters(currentCommenters);

			this.setState({
				searchText: ''
			});
		}
	}

	render() {
		const { allCommenters, commentersIds } = this.props;
		const { commenters } = this.state;
		const commentersList = [];
		allCommenters.forEach((commenter) => {
			if (commentersIds.indexOf(commenter._id) === -1) {
				commentersList.push(commenter);
			}
		});

		console.log('commentersList LOG', commentersList);

		const actions = [
			<FlatButton
				label="Close"
				primary
				onClick={this.props.handleClose}
			/>,
		];

		const iconButtonElement = (
			<IconButton
				touch
			>
				<MoreVertIcon color={grey400} />
			</IconButton>
		);

		return (
			<Dialog
				title="Commenters"
				actions={actions}
				modal={false}
				open={this.props.open}
				onRequestClose={this.props.handleClose}
				autoScrollBodyContent
			>
				<div className="text-node-editor-meta-form edit-subwork-form">
					<div className="edit-form-input">


						<div>
							<List>
								{commenters.map((commenter, index) =>
									<div key={`${commenter.slug}-div`}>
										<ListItem
											primaryText={commenter.name}
											key={`${commenter.slug}`}
											rightIconButton={
												<IconMenu iconButtonElement={iconButtonElement}>
													<MenuItem
														onClick={() => this.deleteCommenter(index)}
													>Remove from comment</MenuItem>
												</IconMenu>
											}
											leftAvatar={commenter.avatar ? <Avatar src={commenter.avatar.src} /> : <Person />}
										/>
										<Divider key={`${commenter.slug}-divider`} />
									</div>
								)}
							</List>
						</div>

						<label>
							Add new
						</label>
						<AutoComplete
							hintText="enter commentator"
							dataSource={commentersList}
							dataSourceConfig={{text: 'name', value: 'slug'}}
							onNewRequest={this.selectCommenter}
							onUpdateInput={this.changeSearchTextValue}
							filter={(searchText, key) => searchText !== '' && key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1}
							fullWidth
							openOnFocus
							searchText={this.state.searchText}
						/>
					</div>

				</div>
			</Dialog>
		);
	}
}

CommentersEditorDialog.propTypes = {
	currentCommenters: PropTypes.array,
	setCommenters: PropTypes.func,
	allCommenters: PropTypes.array,
	commentersIds: PropTypes.array,
	handleClose: PropTypes.func,
	open: PropTypes.bool,
};

const CommentersEditorDialogContainer = createContainer(({ commenters }) => {
	Meteor.subscribe('commenters.all', {tenantId: Session.get('tenantId')});
	const commentersIds = commenters.map(commenter => commenter._id);
	const allCommenters = Commenters.find().fetch();
	const currentCommenters = Commenters.find({_id: {$in: commentersIds}}).fetch();

	return {
		commentersIds,
		allCommenters,
		currentCommenters
	};
}, CommentersEditorDialog);

export default CommentersEditorDialogContainer;
