import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Tabs, Tab} from 'material-ui/Tabs';

// layouts & components
import Header from '/imports/ui/layouts/header/Header';
import Footer from '/imports/ui/components/footer/Footer';
import { SnackAttack } from '/imports/ui/components/shared/SnackAttack';
import LoadingHome from '/imports/ui/components/loading/LoadingHome';

// api
import Settings from '/imports/api/collections/settings';

// lib
import muiTheme from '/imports/lib/muiTheme';


class RecentActivity extends React.Component {
	static propTypes = {
		comments: React.PropTypes.array,
	}

	render() {
		const { comments } = this.props;

		return (
			<div>
				{comments.length}
				adsf;lkjasdf;lksadj;dslakj
			</div>
		);
	}
}

const RecentActivityContainer = createContainer(() => {
	const foobar = true;

	return {
		comments: [],
	};

}, RecentActivity);

export default RecentActivityContainer;
