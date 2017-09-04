import React from 'react';
import { Meteor } from 'meteor/meteor';
import autoBind from 'react-autobind';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import { createContainer } from 'meteor/react-meteor-data';
import {
	FormGroup,
	ControlLabel,
} from 'react-bootstrap';
import Select from 'react-select';
import update from 'immutability-helper';

// api
import Keywords from '/imports/models/keywords';

// components
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';

const ListGroupItemDnD = createListGroupItemDnD('tagBlocks');

class TagsInput extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);

		this.state = {
			tagsValue: [],
		};
	}

	addTagBlock() {
		this.state.tagsValue.push({
			tagId: Random.id(),
			isNotMentionedInLemma: false,
			isSet: false,
		});
		this.setState({
			tagsValue: this.state.tagsValue,
		});
	}

	removeTagBlock(i) {
		this.setState({
			tagsValue: update(this.state.tagsValue, { $splice: [[i, 1]] }),
		});
	}

	moveTagBlock(dragIndex, hoverIndex) {
		const { tagsValue } = this.state;
		const dragIntroBlock = tagsValue[dragIndex];

		this.setState(update(this.state, {
			tagsValue: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragIntroBlock],
				],
			},
		}));
	}

	onTagValueChange(tag) {
		const tagsValue = this.state.tagsValue;

		tagsValue[tag.i].tagId = tag.value;
		tagsValue[tag.i].keyword = Keywords.findOne({_id: tag.value});
		tagsValue[tag.i].isSet = true;

		this.setState({
			tagsValue,
		});
	}

	onIsMentionedInLemmaChange(tag, i) {
		const tagsValue = this.state.tagsValue;

		tagsValue[i].isNotMentionedInLemma = !tag.isNotMentionedInLemma;

		this.setState({
			tagsValue,
		});
	}


	render () {
		const { tags } = this.props;
		const { tagsValue } = this.state;

		return (
			<div className="comment-reference comment-tags">
				<h4>Tag(s):</h4>
				<FormGroup
					controlId="tags"
					className="form-group--referenceWorks"
				>
					<ListGroupDnD>
						{/*
							DnD: add the ListGroupItemDnD component
							IMPORTANT:
							"key" prop must not be taken from the map function - has to be unique like _id
							value passed to the "key" prop must not be then edited in a FormControl component
								- will cause errors
							"index" - pass the map functions index variable here
						*/}
						{tagsValue.map((tag, i) => {
							const _tagsOptions = [];
							tags.forEach((t) => {
								_tagsOptions.push({
									value: t._id,
									label: t.title,
									slug: t.slug,
									type: t.type,
									i,
								});
							});

							return (
								<ListGroupItemDnD
									key={tag.tagId}
									index={i}
									className="form-subitem form-subitem--referenceWork"
									moveListGroupItem={this.moveTagBlock}
								>
									<div
										className="reference-work-item"
									>
										<div
											className="remove-reference-work-item"
											onClick={this.removeTagBlock.bind(this, i)}
										>
											<IconButton
												iconClassName="mdi mdi-close"
												style={{
													padding: '0',
													width: '32px',
													height: '32px',
													borderRadius: '100%',
													border: '1px solid #eee',
													color: '#666',
													margin: '0 auto',
													background: '#f6f6f6',
												}}
											/>
										</div>
										<Select
											name="tags"
											id="tags"
											required={false}
											options={_tagsOptions}
											defaultValue={tagsValue[i].tagId}
											value={tagsValue[i].tagId}
											onChange={this.onTagValueChange}
											placeholder="Tags . . ."
										/>
										<FormGroup>
											<ControlLabel>Tag type: </ControlLabel>
											{tagsValue[i].keyword && tagsValue[i].keyword.type ? tagsValue[i].keyword.type : 'no tag selected'}
										</FormGroup>
										<FormGroup>
											<ControlLabel>Is Not Mentioned in Lemma: </ControlLabel>
											<Checkbox
												name={`${i}_isNotMentionedInLemma`}
												checked={tagsValue[i].isNotMentionedInLemma}
												onCheck={this.onIsMentionedInLemmaChange.bind(null, tag, i)}
												style={{
													display: 'inline-block',
													verticalAlign: 'top',
													width: 'auto',
												}}
											/>
										</FormGroup>
									</div>
								</ListGroupItemDnD>
							);
						})}
					</ListGroupDnD>
					<RaisedButton
						label="Add Tag"
						onClick={this.addTagBlock}
					/>
				</FormGroup>
			</div>
		);
	}
}

const TagsInputContainer = createContainer(() => {
	Meteor.subscribe('keywords.all', { tenantId: Session.get('tenantId') });
	const tags = Keywords.find().fetch();

	return {
		tags,
	};

}, TagsInput);

export default TagsInputContainer;
