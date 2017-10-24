import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import {grey400} from 'material-ui/styles/colors';
import _ from 'underscore';
import {Meteor} from 'meteor/meteor';
import Cookies from 'js-cookie';

class MultilineDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setValue = this.setValue.bind(this);
		this.deleteMultiline = this.deleteMultiline.bind(this);
		this.state = {
			edition: this.props.edition
		};
	}

	setValue(event) {
		this.setState({
			multiline: event.target.value
		});
	}

	handleSubmit() {
		Meteor.call('multiline.insert', Cookies.get('loginToken'), this.state.edition, this.state.multiline, (err) => {
			if (err) {
				throw new Error(err);
			}
		});
	}

	deleteMultiline(multiline) {
		Meteor.call('multiline.delete', Cookies.get('loginToken'), this.state.edition, multiline, (err) => {
			if (err) {
				throw new Error(err);
			}
		});
	}

	render() {
		const { edition } = this.props;

		const actions = [
			<FlatButton
				label="Close"
				primary
				onClick={this.props.handleClose}
			/>,
			<FlatButton
				label="Submit"
				primary
				keyboardFocused
				onClick={this.handleSubmit}
			/>,
		];

		const iconButtonElement = (
			<IconButton
				touch
				tooltipPosition="bottom-left"
			>
				<MoreVertIcon color={grey400} />
			</IconButton>
		);

		return (
			<Dialog
				title="Text editions"
				actions={actions}
				modal={false}
				open={this.props.open}
				onRequestClose={this.props.handleClose}
				autoScrollBodyContent
			>
				<div className="text-node-editor-meta-form edit-subwork-form">
					<div className="edit-form-input">

						{edition.multiline && edition.multiLine.length ?
							<div>
								<label>
									Current editions:
								</label>
								<List>
									{edition.multiLine.map((multiline, index) =>
										<div key={`${multiline}-div`}>
											<ListItem
												primaryText={multiline} key={`${multiline}-index`}
												rightIconButton={
													<IconMenu iconButtonElement={iconButtonElement}>
														<MenuItem onClick={() => this.deleteMultiline(multiline)}>Delete</MenuItem>
													</IconMenu>
												}
											/>
											<Divider key={`${multiline}-divider`} />
										</div>
									)}
								</List>
							</div> : ''
						}
						<label>
							Add new
						</label>
						<TextField
							name="multiline"
							defaultValue={this.state.multiline}
							onChange={this.setValue}
							fullWidth
						/>
					</div>

				</div>
			</Dialog>
		);
	}
}

export default MultilineDialog;