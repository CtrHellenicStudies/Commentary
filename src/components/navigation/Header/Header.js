import React from 'react';
import PropTypes from 'prop-types';

// components
import NavBar from './NavBar';
import LeftMenu from '../LeftMenu';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// actions
import * as authActions from '../../../modules/auth/actions';


import './Header.css';


class Header extends React.Component {
	render() {
		const {
			toggleAuthModal, userId, initialSearchEnabled,
		} = this.props;

		return (
			<div>
				<LeftMenu />
				<NavBar
					toggleAuthModal={toggleAuthModal}
					userId={userId}
					initialSearchEnabled={initialSearchEnabled}
				/>
			</div>
		);
	}
};

Header.propTypes = {
	toggleAuthModal: PropTypes.func.isRequired,
	userId: PropTypes.string,
};

Header.defaultProps = {
	userId: null
};

const mapStateToProps = state => ({
	userId: state.auth.userId,
});

const mapDispatchToProps = dispatch => ({
	toggleAuthModal: (e) => {
		e.preventDefault();
		dispatch(authActions.toggleAuthModal());
	},
});

export default compose(
	connect(mapStateToProps, mapDispatchToProps)
)(Header);
