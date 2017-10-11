import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

// api:
import Tenants from '/imports/models/tenants';
import Settings from '/imports/models/settings';
import { Link } from 'react-router-dom';

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
const LeftMenu = ({ open, closeLeftMenu, tenant, currentUser, settings }) => (
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
						href="/tags/create"
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
		<MenuItem
			href="/"
			primaryText="Home"
			onClick={closeLeftMenu}
		/>
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
LeftMenu.propTypes = {
	open: React.PropTypes.bool.isRequired,
	closeLeftMenu: React.PropTypes.func.isRequired,
	tenant: React.PropTypes.shape({
		isAnnotation: React.PropTypes.bool.isRequired,
	}),
	currentUser: React.PropTypes.shape({
		profile: React.PropTypes.shape({
			avatarUrl: React.PropTypes.string,
			name: React.PropTypes.string,
		}),
		username: React.PropTypes.string,
	}),
};
LeftMenu.defaultProps = {
	tenant: null,
	currentUser: null,
};
/*
	END LeftMenu
*/


export default createContainer(() => {
	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));
	return {
		settings: Settings.findOne({}),
		currentUser: Meteor.users.findOne({_id: Meteor.userId()}),
		tenant: Tenants.findOne({_id: Session.get('tenantId')})
	};
}, LeftMenu);
