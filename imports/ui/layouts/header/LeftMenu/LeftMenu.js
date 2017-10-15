import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

// models:
import Tenants from '/imports/models/tenants';
import Settings from '/imports/models/settings';

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
				<MenuItem
					href="/commentary/create"
					primaryText="Add Comment"
					onClick={closeLeftMenu}
				/>
				<MenuItem
					href="/tags/create"
					primaryText="Add Tag"
					onClick={closeLeftMenu}
				/>
				<MenuItem
					href="/textNodes/edit"
					primaryText="Add Translation"
					onClick={closeLeftMenu}
				/>
				<MenuItem
					href="/textNodes/edit"
					primaryText="Edit Source Text"
					onClick={closeLeftMenu}
				/>
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
				<MenuItem
					href="/commentary"
					primaryText="Commentary"
					onClick={closeLeftMenu}
				/>
				<MenuItem
					href="/words"
					primaryText="Words"
					onClick={closeLeftMenu}
				/>
				<MenuItem
					href="/ideas"
					primaryText="Ideas"
					onClick={closeLeftMenu}
				/>
				<MenuItem
					href="/commenters"
					primaryText="Commentators"
					onClick={closeLeftMenu}
				/>
				<MenuItem
					href="/referenceWorks"
					primaryText="Reference Works"
					onClick={closeLeftMenu}
				/>
				<MenuItem
					href={settings && settings.aboutURL ? settings.aboutURL : '/about'}
					primaryText="About"
					onClick={closeLeftMenu}
				/>
				<MenuItem
					href="/#visualizations"
					primaryText="Visualizations"
					onClick={closeLeftMenu}
				/>
			</span>
		}
		<Divider />

		{Meteor.user() ?
			<div>
				<MenuItem
					href="/profile"
					primaryText="Profile"
					onClick={closeLeftMenu}
				/>
				<MenuItem
					href="/sign-out"
					primaryText="Sign out"
					onClick={closeLeftMenu}
				/>
			</div>
			:
			<div>
				<MenuItem
					href="/sign-in"
					primaryText="Sign in"
					onClick={closeLeftMenu}
				/>
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
