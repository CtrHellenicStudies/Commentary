import React from 'react';
import PropTypes from 'prop-types';

class AccountsLayout extends React.Component {
	render() {
		return (
			<main>
				{this.props.content}
			</main>
		);
	}
}

AccountsLayout.propTypes = {
	content: PropTypes.object,
};

export default AccountsLayout;
