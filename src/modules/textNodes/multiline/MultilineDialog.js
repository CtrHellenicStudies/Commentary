import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import { compose } from 'react-apollo';
import { editionsInsertMutation,
	editionsRemoveMutation} from '../../../graphql/methods/editions';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import { grey400 } from 'material-ui/styles/colors';

class MultilineDialog extends Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setValue = this.setValue.bind(this);
		this.deleteMultiline = this.deleteMultiline.bind(this);
		this.state = {
			edition: this.props.edition,
			error: '',
			multiline: ''
		};
	}

	setValue(event) {
		this.setState({
			multiline: event.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		if (this.state.multiline === '') {
			this.setState({
				error: {
					message: "Edition can't be empty!"
				}
			});

		} else {
			const edition = {
				_id: this.state.edition._id,
				title: this.state.edition.title,
				slug: this.state.edition.slug
			};
			this.props.editionsInsert(edition, this.state.multiline).then(res => {
				console.log(res);
				if (res.err) {
					this.setState({
						error: res.err
					});
					throw new Error(res.err);
				} else {
					this.setState({
						multiline: ''
					});
				}
			});
		}
	}

	deleteMultiline(multiline) {
		this.props.editionsRemove(this.state.edition, multiline).then(res => {
			console.log(res.res);
			if (res.err) {
				this.setState({
					error: res.err
				});
				throw new Error(res.err);
			} else {
				this.setState({
					multiline: ''
				});
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

		const error = this.state.error ? <div>{this.state.error.message}</div> : null;
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

						{edition.multiLine && edition.multiLine.length ?
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
						<form onSubmit={this.handleSubmit}>
							<TextField
								name="multiline"
								value={this.state.multiline}
								onChange={this.setValue}
								fullWidth
								errorText={error}
							/>
						</form>
					</div>

				</div>
			</Dialog>
		);
	}
}

MultilineDialog.propTypes = {
	edition: PropTypes.object,
	handleClose: PropTypes.func,
	open: PropTypes.bool,
	editionsInsert: PropTypes.func,
	editionsRemove: PropTypes.func
};


export default compose(editionsInsertMutation, editionsRemoveMutation)(MultilineDialog);
