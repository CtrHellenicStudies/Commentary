import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { compose } from 'react-apollo';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

// models:
import { Link } from 'react-router-dom';

// graphql
import { tenantsQuery } from '/imports/graphql/methods/tenants';
import { settingsQuery } from '/imports/graphql/methods/settings';

// components:
import SideNavTop from '/imports/ui/components/header/SideNavTop';
import MenuItem from '/imports/ui/components/shared/MenuItem';


/*
	helpers
*/
const getUsername = (currentUser) => {
	let username = '';
	if (currentUser) {
		if (currentUser.profile && currentUser.profile.name) {
			username = currentUser.profile.name;
		} else {
			username = currentUser.username;
		}
	}
	return username;
};


/*
	BEGIN LeftMenu
*/
class LeftMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tenantId: sessionStorage.getItem('tenantId')
		};
	}

	componentWillReceiveProps(nextProps) {

		this.setState({
			currentUser: Meteor.users.findOne({_id: Meteor.userId()})
		});
	}

	render() {
		const { open, closeLeftMenu } = this.props;
		const { tenant, settings, currentUser } = this.state;

		let tenant;
		let settings;
		if (this.props.tenantsQuery && !this.props.tenantsQuery.loading) {
			tenant = this.props.tenantsQuery.tenants.find(x => x._id === this.state.tenantId);
		}
		if (this.props.settingsQuery && !this.props.settingsQuery.loading) {
		 	settings = this.props.settingsQuery.settings.find(x => x.tenantId === this.state.tenantId);
		}

		return (

			<Drawer
				open={open}
				docked={false}
				onRequestChange={closeLeftMenu}
				className="md-sidenav-left"
			>
				<SideNavTop
					currentUser={currentUser}
					username={getUsername(currentUser)}
				/>
				{tenant && !tenant.isAnnotation && Roles.userIsInRole(Meteor.userId(), ['editor', 'admin', 'commenter']) ?
					<div>
						{tenant && !tenant.isAnnotation && Roles.userIsInRole(Meteor.userId(), ['admin']) ?
							<MenuItem
								href="http://ahcip-admin.chs.harvard.edu"
								target="_blank"
								primaryText="Admin"
								onClick={closeLeftMenu}
							/>
						: ''}
						<Link to="/commentary/create">
							<MenuItem
								primaryText="Add Comment"
								onClick={closeLeftMenu}
							/>
						</Link>
						<Link to="/tags/create">
							<MenuItem
								primaryText="Add Tag"
								onClick={closeLeftMenu}
							/>
						</Link>
						<Link to="/textNodes/edit">
							<MenuItem
								primaryText="Add Translation"
								onClick={closeLeftMenu}
							/>
						</Link>
						<Link to="/textNodes/edit">
							<MenuItem
								primaryText="Edit Source Text"
								onClick={closeLeftMenu}
							/>
						</Link>

						<Divider />
					</div>
					:
					'' }
				<Link to="/">
					<MenuItem
						primaryText="Home"
						onClick={closeLeftMenu}
					/>
				</Link>
				{tenant && !tenant.isAnnotation &&
					<span>
						<Link to="/commentary">
							<MenuItem
								primaryText="Commentary"
								onClick={closeLeftMenu}
							/>
						</Link>
						<Link to="/words">
							<MenuItem
								primaryText="Words"
								onClick={closeLeftMenu}
							/>
						</Link>
						<Link to="/ideas">
							<MenuItem
								primaryText="Ideas"
								onClick={closeLeftMenu}
							/>
						</Link>
						<Link to="/commenters">
							<MenuItem
								primaryText="Commentators"
								onClick={closeLeftMenu}
							/>
						</Link>
						<Link to="/referenceWorks">
							<MenuItem
								primaryText="Reference Works"
								onClick={closeLeftMenu}
							/>
						</Link>
						<Link to={settings && settings.aboutURL ? settings.aboutURL : '/about'}>
							<MenuItem
								primaryText="About"
								onClick={closeLeftMenu}
							/>
						</Link>
						<Link to="/#visualizations">
							<MenuItem
								primaryText="Visualizations"
								onClick={closeLeftMenu}
							/>
						</Link>

					</span>
				}
				<Divider />

				{Meteor.user() ?
					<div>
						<Link to="/profile">
							<MenuItem
								primaryText="Profile"
								onClick={closeLeftMenu}
							/>
						</Link>
						<Link to="/sign-out">
							<MenuItem
								primaryText="Sign out"
								onClick={closeLeftMenu}
							/>
						</Link>
					</div>
					:
					<div>
						<Link to="/sign-in">
							<MenuItem
								primaryText="Sign in"
								onClick={closeLeftMenu}
							/>
						</Link>
					</div>
				}
			</Drawer>
		);
	}
}

LeftMenu.propTypes = {
	open: PropTypes.bool.isRequired,
	closeLeftMenu: PropTypes.func.isRequired,
	settingsQuery: PropTypes.object,
	tenantsQuery: PropTypes.object,
};

LeftMenu.defaultProps = {
	tenant: null,
	currentUser: null,
};
/*
	END LeftMenu
*/

export default compose(
	tenantsQuery,
	settingsQuery
)(LeftMenu);
