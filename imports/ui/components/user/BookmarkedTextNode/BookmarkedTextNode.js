import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// api
import Works from '/imports/api/collections/works';

// lib
import muiTheme from '/imports/lib/muiTheme';


const BookmarkedTextNode = React.createClass({

	propTypes: {
		text: React.PropTypes.object,
		work: React.PropTypes.object,
		isOdd: React.PropTypes.bool,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	getTextLocation() {
		const text = this.props.text;
		let location = '';
		let textN = '';

		if (!text) {
			return {
				location,
				textN,
			};
		}

		if ('n_1' in text) {
			location += text.n_1;
			textN = text.n_1;
		}
		if ('n_2' in text) {
			location += `.${text.n_2}`;
			textN = text.n_2;
		}
		if ('n_3' in text) {
			location += `.${text.n_3}`;
			textN = text.n_3;
		}
		if ('n_4' in text) {
			location += `.${text.n_4}`;
			textN = text.n_4;
		}
		if ('n_5' in text) {
			location += `.${text.n_5}`;
			textN = text.n_5;
		}

		return {
			location,
			textN,
		};
	},

	handleClick() {

	},


	render() {
		const { text, work } = this.props;
		let textClasses = 'text-node bookmark-text-node clearfix';
		const textLocation = this.getTextLocation();
		let workTitle = '';
		let link = '';

		if (!text) {
			return null;
		}

		if (work) {
			workTitle = work.english_title;
			link = `/works/${work._id}/${work.slug}?location=${textLocation.location}`;
		}

		if (this.props.isOdd) {
			textClasses = `${textClasses} bookmark-text-node--odd`;
		}

		if ((parseInt(textLocation.textN, 10) % 5) === 0) {
			textClasses = `${textClasses} show-number`;
		}

		return (
			<a
				className={textClasses}
				data-id={text._id}
				data-loc={textLocation.location}
				href={link}
			>
				<div className="text-left-header">
					<h2 className="section-numbering">{Utils.trunc(workTitle, 40)} {textLocation.location}</h2>
				</div>

				<p
					className="text-html"
					ref={(ref) => {
						this.anchorEl = ref;
						return ref;
					}}
				>
					{text.text && text.text.length ?
						<span>{Utils.trunc(text.text, 120)}</span>
					:
						<span>[ . . . ]</span>
					}
				</p>

			</a>
		);
	},
});

const BookmarkedTextNodeContainer = createContainer(({ text }) => {
	let work = null;
	if (text) {
		const query = { _id: text.work };
		const handleWorks = Meteor.subscribe('works', Session.get('tenantId'));
		work = Works.findOne(query);
	}

	return {
		work,
	};
}, BookmarkedTextNode);

export default BookmarkedTextNodeContainer;
