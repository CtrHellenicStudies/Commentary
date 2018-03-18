import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import { commentersQuery } from '../../../graphql/methods/commenters';
import { compose } from 'react-apollo';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import { grey400 } from 'material-ui/styles/colors';
import _ from 'underscore';

import Cookies from 'js-cookie';
import Select from 'react-select';
import AutoComplete from 'material-ui/AutoComplete';
import Person from 'material-ui/svg-icons/social/person';

class CommentersEditorDialog extends Component {

	constructor(props) {
		super(props);
		this.state = {
			searchText: ''
		};
		this.deleteCommenter = this.deleteCommenter.bind(this);
		this.selectCommenter = this.selectCommenter.bind(this);
		this.changeSearchTextValue = this.changeSearchTextValue.bind(this);

		this.props.commentersQuery.refetch({
			tenantId: sessionStorage.getItem('tenantId')
		});
	}
	componentWillReceiveProps(props) {

		const commentersIds = props.commenters.map(commenter => commenter._id);
		const allCommenters = props.commentersQuery.loading ? [] : props.commentersQuery.commenters;
		const currentCommenters = props.commentersQuery.loading ? [] : props.commentersQuery.commenters.filter(x =>
			commentersIds.find(y => y === x._id));
	
		this.setState({
			commentersIds,
			allCommenters,
			currentCommenters
		});
	}
	deleteCommenter(index) {
		const currentCommenters = this.state.currentCommenters;
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
			const currentCommenters = this.state.currentCommenters;
			currentCommenters.push(commenter);

			this.props.setCommenters(currentCommenters);

			this.setState({
				searchText: ''
			});
		}
	}

	render() {
		const { allCommenters, commentersIds } = this.state;
		const { currentCommenters } = this.state;
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
				iconClassName="material-icons"
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
								{allCommenters.map((commenter, index) =>
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
	setCommenters: PropTypes.func,
	handleClose: PropTypes.func,
	open: PropTypes.bool,
	commenters: PropTypes.array,
	commentersQuery: PropTypes.object
};

export default compose(commentersQuery)(CommentersEditorDialog);