import React from 'react';

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
	content: React.PropTypes.object,
};

export default AccountsLayout;
