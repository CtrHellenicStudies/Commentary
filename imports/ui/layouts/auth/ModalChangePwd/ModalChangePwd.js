import React from 'react';
import { Meteor } from 'meteor/meteor';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// lib
import muiTheme from '/imports/lib/muiTheme';

ModalChangePwd = React.createClass({

	propTypes: {
		lowered: React.PropTypes.bool,
		closeModal: React.PropTypes.func,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	render() {
		const lowered = this.props.lowered;

		return (
			<div>
				{Meteor.userId() ?
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
							<BlazeToReact blazeTemplate="atForm" state="changePwd" />
						</div>
					</div>
					: ''
				}
			</div>
		);
	},
});
