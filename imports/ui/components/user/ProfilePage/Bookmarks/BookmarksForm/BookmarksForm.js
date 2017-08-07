import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

// api
import Works from '/imports/api/collections/works';

class BookmarksForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedWork: null,
			selectedSubwork: null,
			selectedLineFrom: null,
			selectedLineTo: null
		};

		this.submit = this.submit.bind(this);
		this.getWork = this.getWork.bind(this);
		this.getSubwork = this.getSubwork.bind(this);
	}

	static propTypes = {
		works: React.PropTypes.array
	}

	static deafultProps = {
		works: []
	}

	componentWillReceiveProps(nextProps) {
		const {works} = this.props;

		if (nextProps !== this.props) {
			this.setState({
				selectedWork: nextProps.works[0],
				selectedSubwork: nextProps.works[0].subworks[0]
			});
			console.log(nextProps);
		}
	}

	getWork(event, index, value) {
		this.setState({
			selectedWork: value,
		});
	}

	getSubwork(event, index, value) {
		this.setState({
			selectedSubwork: value
		});
	}

	getLineTo(event, newValue) {
		this.setState({
			selectedLineTo: newValue
		});
	}

	getLineFrom(event, newValue) {
		this.setState({
			selectedLineFrom: newValue
		});
	}

	submit() {

	}

	render() {
		const {works} = this.props;
		const {selectedWork, selectedSubwork, subworks} = this.state;
		
		console.log(works)
		console.log(selectedWork)

		if (!selectedWork || !works) { return <div />; }

		return (
			<div>
				<SelectField 
					floatingLabelText="Select Work"
					value={selectedWork}
					onChange={this.getWork}
				>
					{works.map(work => 
						<MenuItem 
							key={work.slug}
							value={work} 
							primaryText={work.title} 
						/>
					)}
				</SelectField>
				<SelectField 
					floatingLabelText="Select Subwork"
					value={selectedSubwork}
					onChange={this.getSubwork}
				>
					{selectedWork.subworks.map(subwork => 
						<MenuItem 
							key={subwork.slug}
							value={subwork.slug} 
							primaryText={subwork.title} 
						/>
					)}
				</SelectField>
				<TextField 
					floatingLabelText="Line From"
				/>
				<TextField
					floatingLabelText="Line To"
				/>
			</div>
		);
	}
}

const BookmarksFormContainer = createContainer(() => {
	Meteor.subscribe('works', Session.get('tenantId')).ready();
	const works = Works.find().fetch();

	return {
		works
	};
}, BookmarksForm);

export default BookmarksFormContainer;
