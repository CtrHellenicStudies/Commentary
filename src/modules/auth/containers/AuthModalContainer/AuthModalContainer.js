import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from '../../../../components/common/modal/Modal';

// auth types:
import Login from '../../components/Login';
import Signup from '../../components/Signup';

// actions
import { toggleAuthModal, changeAuthMode, setUser, login, logout } from '../../actions';


const ESCAPE_KEY = 27;


class AuthModalContainer extends React.Component {

	static propTypes = {
		dispatchLogin: PropTypes.func.isRequired,
		dispatchSignup: PropTypes.func.isRequired,
		dispatchToggleAuthModal: PropTypes.func.isRequired,
		dispatchChangeAuthMode: PropTypes.func.isRequired,
		showAuthModal: PropTypes.bool,
		authMode: PropTypes.string,
	};

	static defaultProps = {
		showAuthModal: false,
		authMode: 'login'
	};

	constructor(props) {
		super(props);

		// methods:
		this._handleKeyDown = this._handleKeyDown.bind(this);
		this._initiateUser = this._initiateUser.bind(this);
	}

	componentWillMount() {
		document.addEventListener('keydown', this._handleKeyDown);

		this._initiateUser();
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this._handleKeyDown);
	}

	_handleKeyDown(event) {
		const { dispatchToggleAuthModal, showAuthModal } = this.props;
		if (event.keyCode === ESCAPE_KEY && showAuthModal) dispatchToggleAuthModal();
	}

	async _initiateUser() {
		const { getUserFromServer, dispatchSetUser } = this.props;
		if (getUserFromServer) {
			try {
				const user = await getUserFromServer();
				if (user) {
					user.userId = user._id;
					user.commenters = user.canEditCommenters;
					dispatchSetUser(user);
				}
			} catch (err) {
				console.error(err);
				// TODO: Determine why dispatchLogout always called on page load
				// dispatchLogout();
			}
		}
	}

	render() {
		const { showAuthModal, dispatchToggleAuthModal, authMode, dispatchChangeAuthMode, dispatchLogin, dispatchSignup } = this.props;

		return (
			<Modal
				show={showAuthModal}
				closeModal={dispatchToggleAuthModal}
			>
				<div>
					{authMode === 'login' ?
						<Login
							onRegisterClick={dispatchChangeAuthMode.bind(null, 'signup')}
							login={dispatchLogin}
						/>
					: null}
					{authMode === 'signup' ?
						<Signup
							onSigninClick={dispatchChangeAuthMode.bind(null, 'login')}
							signup={dispatchSignup}
						/>
					: null}
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => ({
	authMode: state.auth.authMode,
	showAuthModal: state.auth.showAuthModal,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	dispatchToggleAuthModal: (value) => {
		dispatch(toggleAuthModal(value));
	},
	dispatchChangeAuthMode: (mode) => {
		dispatch(changeAuthMode(mode));
	},
	dispatchSetUser: (userObject) => {
		dispatch(setUser(userObject));
		dispatch(toggleAuthModal(false));
	},
	dispatchLogin: data => dispatch(login(ownProps.loginMethod, data)),
	dispatchSignup: data => dispatch(login(ownProps.signupMethod, data)),
	dispatchLogout: () => {
		dispatch(logout(ownProps.logoutMethod));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AuthModalContainer);
