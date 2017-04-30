import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import { createContainer } from 'meteor/react-meteor-data';

// api:
import Tenants from '/imports/api/collections/tenants'; // eslint-disable-line import/no-absolute-path

// components:
import SideNavTop from '/imports/ui/components/header/SideNavTop'; // eslint-disable-line import/no-absolute-path


/*
	helpers
*/
const getUsername = (currentUser) => {
	let username = '';
	if (Meteor.user()) {
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
const LeftMenu = ({ open, closeLeftMenu, tenant, currentUser }) => (
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
					href="/keywords/create"
					primaryText="Add Keyword/Idea"
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
					href="/keywords"
					primaryText="Keywords"
					onClick={closeLeftMenu}
				/>
				<MenuItem
					href="/keyideas"
					primaryText="Key Ideas"
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
					href="/about"
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


export default createContainer(() => (
	{
		currentUser: Meteor.users.findOne({ _id: Meteor.userId() }),
		tenant: Tenants.findOne({ _id: Session.get('tenantId') })
	}
), LeftMenu);
