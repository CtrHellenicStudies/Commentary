import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

// api
import Works from '/imports/api/collections/works';

class BookmarksForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedWork: 'iliad'
		};

		this.submit = this.submit.bind(this);
	}

	submit() {

	}

	render() {
		const {works} = this.props;
		const {selectedWork} = this.state;

		console.log(works);

		return (
			<div>
				<SelectField 
					floatingLabelText="Select Work"
					value={selectedWork}
					onChange={this.getWork}
					autoWidth={true}
				>
					{works.map(work => 
						<MenuItem 
							key={work.slug}
							value={work.slug} 
							primaryText={work.title} 
						/>
					)}
				</SelectField>
			</div>
		);
	}
}

const BookmarksFormContainer = createContainer(() => {
	Meteor.subscribe('works', Session.get('tenantId'));
	
	const works = Works.find().fetch();

	return {
		works
	};
}, BookmarksForm);

export default BookmarksFormContainer;
