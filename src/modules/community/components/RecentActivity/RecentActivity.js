import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// components
import RecentActivityListContainer from '../../containers/RecentActivityListContainer';

// lib
import muiTheme from '../../../../lib/muiTheme';



import './RecentActivity.css';




class RecentActivity extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			skip: 0,
			limit: 12,
		};
	}

	loadMore() {
		this.setState({
			limit: this.state.limit + 12,
		});
	}

	render() {
		const { skip, limit } = this.state;

		return (
			<div className="recentActivity">
				<h3>Recent Community Activity</h3>
				<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
					<RecentActivityListContainer
						skip={skip}
						limit={limit}
						loadMore={this.loadMore.bind(this)}
					/>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default RecentActivity;
