import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import muiTheme from '/imports/lib/muiTheme';
import RecentActivityList from '../RecentActivityList';


class RecentActivity extends Component {

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
					<RecentActivityList
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
