import React from 'react';

class Translation extends React.Component {
	render() {
		const { commentGroup } = this.props;
		console.log('commentGroup: ', commentGroup);
		return (
			<p>Hey now</p>
		);
	}
}
export default Translation;
