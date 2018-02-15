import React, { Component } from 'react';
import PropTypes from 'prop-types';

// components
import NavBar from './NavBar';
import LeftMenu from '../LeftMenu';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// actions
import * as authActions from '../../../modules/auth/actions';

class Header extends Component {
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

export default compose(
	connect(mapStateToProps, mapDispatchToProps)
)(Header);
