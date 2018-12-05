import React from 'react';
import PropTypes from 'prop-types';

// components
import NavBar from './NavBar';
import LeftMenu from '../LeftMenu';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

import './Header.css';


class Header extends React.Component {
	render() {
		const {
			userId, initialSearchEnabled,
		} = this.props;

		return (
			<div>
				<LeftMenu />
				<NavBar
					userId={userId}
					initialSearchEnabled={initialSearchEnabled}
				/>
			</div>
		);
	}
};

Header.propTypes = {
	userId: PropTypes.string,
};

Header.defaultProps = {
	userId: null
};

const mapStateToProps = state => ({
	userId: state.auth.userId,
});

export default compose(
	connect(mapStateToProps),
)(Header);
