import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import { EditorState } from 'draft-js';
import DraftEditorInput from '../../../inputs/components/DraftEditorInput/DraftEditorInput';
import Utils from '../../../../lib/utils';
import { debounce } from 'throttle-debounce';

class Account extends React.Component {
	constructor(props) {
		super(props);
		let biography;
		if (!this.props.user.profile || !this.props.user.profile.biography) {
			biography = EditorState.createEmpty();
		}		else {
			biography = Utils.getEditorState(this.props.user.profile.biography);
		}
		this.state = {
			isPublicEmail: false,
			sernameError: '',
			emailError: '',
			editorState: biography
		};

		this.handleChangeTextDebounced = this.handleChangeTextDebounced.bind(this);
		this.handleChangeText = this.handleChangeText.bind(this);
		this.handleBatchNotification = this.handleBatchNotification.bind(this);
		this.showChangePwdModal = this.showChangePwdModal.bind(this);
	}

	componentWillMount() {
		this.handleChangeTextDebounced = debounce(1000, this.handleChangeTextDebounced);
	}

	handleChangeTextDebounced(field, value) {
		const user = this.props.user;
		// let emailValue = [];
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
		switch (field) {
		case 'username':
			if (/^[a-z0-9A-Z_]{3,15}$/.test(value)) {
				// Meteor.call('updateAccount', field, value, (err) => {
				// 	if (err) {
				// 		console.error(err);
				// 	}
				// }); TODO
			} else {
				this.setState({
					usernameError: 'Username has following the requirements: only letters and ' +
					'numbers are aloud, no whitespaces, min. length: 3, max. length: 15',
				});
			}
			break;
		case 'email':
			if (re.test(value)) {
				this.setState({
					emailError: '',
				});
				if (user.emails && user.emails.length > 0) {
					// emailValue = [{
					// 	address: value || user.emails[0].address,
					// 	verified: user.emails[0].verified,
					// }];
				}
				// Meteor.call('updateAccount', field, emailValue, (err) => {
				// 	if (err) {
				// 		console.error(err);
				// 	}
				// }); TODO
			} else {
				this.setState({
					emailError: 'Invalid email address',
				});
			}
			break;

		default:
			// Meteor.call('updateAccount', `profile.${field}`, value, (err) => {
			// 	if (err) {
			// 		console.error(err);
			// 	}
			// }); TODO
		}
	}

	handleChangeText(field, event) {
		const value = event.target.value;
		this.handleChangeTextDebounced(field, value);
	}
	handleDraftChange(editorState) {
		//const value = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
		// Meteor.call('updateAccount', 'profile.biography', value, (err) => {
		// 	if (err) {
		// 		console.error(err);
		// }); TODO
		this.setState({editorState: editorState});
	}

	handleBatchNotification(event, value) {
		const updateBatch = {};
		//  = Meteor.users.update({_id: Meteor.userId()}, {
		// 	$set: {
		// 		batchNotification: value
		// 	}
		// }); TODO
		return updateBatch;
	}

	showChangePwdModal() {
		this.props.turnOnPassChange();
	}

	render() {
		const { user } = this.props;
		const { usernameError, emailError, isPublicEmail } = this.state;

		const toggleStyle = {
			style: {
				margin: '20px 0 0 0',
			},
		};

		const changePwdStyle = {
			margin: '11px 0 0 0',
		};

		return (
			<div className="user-profile-textfields">

				<TextField
					fullWidth
					floatingLabelText="Username"
					defaultValue={user.username}
					onChange={this.handleChangeText.bind(null, 'username')}
					errorText={usernameError}
				/>
				<br />

				<RaisedButton
					label="Change password"
					style={changePwdStyle}
					onClick={this.showChangePwdModal}
				/>

				{user.emails ?
					<div>
						<TextField
							fullWidth
							floatingLabelText="Email"
							defaultValue={user.emails[0].address}
							onChange={this.handleChangeText.bind(null, 'emails')}
							errorText={emailError}
						/>
						<Toggle
							label={isPublicEmail ? 'Email public' : 'Email private'}
							labelPosition="right"
							style={toggleStyle.style}
							toggled={isPublicEmail}
							onToggle={this.handlePublicEmailToggle}
						/>
					</div>
					: ''
				}

				<TextField
					fullWidth
					floatingLabelText="Name"
					defaultValue={user.profile ? user.profile.name : ''}
					onChange={this.handleChangeText.bind(null, 'name')}
				/>
				<br />

				<DraftEditorInput
					editorState={this.state.editorState}
					onChange={this.handleDraftChange.bind(this)}
					placeholder="Biography..."
					mediaOn
				/>
				<br />

				<TextField
					fullWidth
					hintText="http://university.academia.edu/YourName"
					floatingLabelText="Academia.edu"
					defaultValue={user.profile ? user.profile.academiaEdu : ''}
					onChange={this.handleChangeText.bind(null, 'academiaEdu')}
				/>
				<br />

				<TextField
					fullWidth
					hintText="https://twitter.com/@your_name"
					floatingLabelText="Twitter"
					defaultValue={user.profile ? user.profile.twitter : ''}
					onChange={this.handleChangeText.bind(null, 'twitter')}
				/>
				<br />

				<TextField
					fullWidth
					hintText="https://facebook.com/your.name"
					floatingLabelText="Facebook"
					defaultValue={user.profile ? user.profile.facebook : ''}
					onChange={this.handleChangeText.bind(null, 'facebook')}
				/>
				<br />

				<TextField
					fullWidth
					hintText="https://plus.google.com/+YourName"
					floatingLabelText="Google Plus"
					defaultValue={user.profile ? user.profile.google : ''}
					onChange={this.handleChangeText.bind(null, 'google')}
				/>
				<br />

				<br />
				<br />
				<br />

				<RaisedButton
					label="Saved"
					disabled
				/>
			</div>
		);
	}
}
Account.propTypes = {
	user: PropTypes.object
};
export default Account;
