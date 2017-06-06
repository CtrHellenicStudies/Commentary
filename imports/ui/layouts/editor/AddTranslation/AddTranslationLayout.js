import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import slugify from 'slugify';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import cookie from 'react-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// components:
import Header from '/imports.ui/layouts/header/Header';
import FilterWidget from '/imports/ui/components/commentary/FilterWidget';

// lib
import muiTheme from '/imports/lib/muiTheme';

// helpers
const handlePermissions = () => {
	if (Roles.subscription.read()) {
		if (!Roles.userIsInRole(Meteor.userId(), ['editor', 'admin', 'commenter'])) {
			FlowRouter.go('/')
		}
	}
};


class AddTranslationLayout extends React.Component {
	static propTypes = {
		ready: React.PropTypes.bool,
		isTest: React.PropTypes.bool,
	};

	static defaultProps = {
		ready: false,
		isTest: false,
	};

	constructor(props) {
		super(props);

		this.state = {
			filters: [],
			selectedLineFrom: 0,
			selectedLineTo: 0,
			contextReaderOpen: true,
			loading: false,
			selectedWork: ''
		};

		// methods:
		this.updateSelectedLines = this.updateSelectedLines.bind(this);
		this.toggleSearchTerm = this.toggleSearchTerm.bind(this);

		this.getWork = this.getWork.bind(this);
		this.getSubwork = this.getSubwork.bind(this);
		this.getLineLetter = this.getLineLetter.bind(this);
		this.getSelectedLineTo = this.getSelectedLineTo.bind(this);
		this.closeContextReader = this.closeContextReader.bind(this);
		this.openContextReader = this.openContextReader.bind(this);
		this.lineLetterUpdate = this.lineLetterUpdate.bind(this);
		this.handleChangeLineN = this.handleChangeLineN.bind(this);
	}

	componentWillUpdate() {
		handlePermissions();
	}

	// line selection
	updateSelectedLines(selectedLineFrom, selectedLineTo) {
		if (selectedLineFrom === null) {
			this.setState({
				selectedLineTo,
			});
		} else if (selectedLineTo === null) {
			this.setState({
				selectedLineFrom,
			});
		} else if (selectedLineTo != null && selectedLineFrom != null {
			this.setState({
				selectedLineFrom,
				selectedLineTo,
			});
		}
	}


}
