import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import createClass from 'create-react-class';

// lib
import muiTheme from '../../lib/muiTheme';

const ModalChangePwd = createClass({

	propTypes: {
		lowered: PropTypes.bool,
		closeModal: PropTypes.func,
	},

	childContextTypes: {
		muiTheme: PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	componentWillMount() {
		document.addEventListener('keydown', this._handleKeyDown);
	},

	componentWillUnmount() {
		document.removeEventListener('keydown', this._handleKeyDown);
	},

	_handleKeyDown(event) {

		const { closeModal } = this.props;

		if (event.keyCode === 'ESCAPE_KEY') closeModal();
	},

	render() {
		const lowered = this.props.lowered;

		return (
			<div>
				{Cookies.getItem('user')._id ?
					<div
						className={`ahcip-modal-login
						ahcip-modal ahcip-login-signup ${((lowered) ? ' lowered' : '')}`}
					>
						<div
							className="close-modal paper-shadow"
							onClick={this.props.closeModal}
						>
							<i className="mdi mdi-close" />
						</div>
						<div className="modal-inner">
							{/* <BlazeToReact blazeTemplate="atForm" state="changePwd" />  TODO*/}
						</div>
					</div>
					: ''
				}
			</div>
		);
	},
});

export default ModalChangePwd;
