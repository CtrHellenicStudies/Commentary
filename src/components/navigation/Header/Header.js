import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// components
import NavBar from './NavBar';
import LeftMenu from '../LeftMenu';

// actions
import * as authActions from '../../../modules/auth/actions';

class Header extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { toggleAuthModal, userId, initialSearchEnabled, workFilters,
			 toggleSearchTerm, handlePagination, work } = this.props;
		return (
		<div>
			<LeftMenu />
			<NavBar
				toggleSearchTerm={toggleSearchTerm}
				toggleAuthModal={toggleAuthModal}
				handlePagination={handlePagination}
				userId={userId}
				work={work}
				initialSearchEnabled={initialSearchEnabled}
				filters={workFilters}
			/>
		</div>
		);
	}
};

Header.propTypes = {
	toggleAuthModal: PropTypes.func.isRequired,
	userId: PropTypes.string,
	workFilters: PropTypes.array
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

export default Header;
