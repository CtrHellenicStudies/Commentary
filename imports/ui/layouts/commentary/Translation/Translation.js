import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { Sticky } from 'react-sticky';

import Utils from '/imports/lib/utils';

// api:
import TextNodes from '/imports/api/collections/textNodes'; 

// components:
import CommentLemmaText from '/imports/ui/components/commentary/commentGroups/CommentLemmaText'; 
import CommentGroupMeta from '/imports/ui/components/commentary/commentGroups/CommentGroupMeta';  

class Translation extends React.Component {
	render() {
		return (
			<p>hey there!</p>
		);
	}
}
export default Translation;
