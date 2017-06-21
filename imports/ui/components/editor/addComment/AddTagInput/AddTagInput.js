import React from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';

import {
	FormGroup,
	ControlLabel,
} from 'react-bootstrap';

import Select from 'react-select';

// components
import { ListGroupDnD, creatListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';

const ListGroupItemDnD = creatListGroupItemDnD('tagBlocks');

class AddTagInput extends React.Component {

	static propTypes = {
		tagsValue: React.PropTypes.arrayOf(React.PropTypes.shape({})),
		tags: React.PropTypes.arrayOf(React.PropTypes.shape({})),

		addTagBlock: React.PropTypes.func.isRequired,
		removeTagBlock: React.PropTypes.func.isRequired,
		moveTagBlock: React.PropTypes.func.isRequired,
		onTagValueChange: React.PropTypes.func.isRequired,
		onIsMentionedInLemmaChange: React.PropTypes.func.isRequired,
	};

	static defaultProps = {
		tagsValue: [],
		tags: [],
	};

	render () {
		const { tagsValue, tags, addTagBlock, removeTagBlock, moveTagBlock, onTagValueChange, onIsMentionedInLemmaChange } = this.props;

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
									moveListGroupItem={moveTagBlock}
								>
									<div
										className="reference-work-item"
									>
										<div
											className="remove-reference-work-item"
											onClick={removeTagBlock.bind(this, i)}
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
											onChange={onTagValueChange}
											placeholder="Tags . . ."
										/>
										<FormGroup>
											<ControlLabel>Tag type: </ControlLabel>
											{tagsValue[i].keyword && tagsValue[i].keyword.type ? tagsValue[i].keyword.type : 'no tag selected'}
										</FormGroup>
										<FormGroup>
											<ControlLabel>Is Mentioned in Lemma: </ControlLabel>
											<Checkbox
												name={`${i}_isMentionedInLemma`}
												checked={tagsValue[i].isMentionedInLemma}
												onCheck={onIsMentionedInLemmaChange.bind(null, tag, i)}
												style={{position: 'absolute', display: 'inline'}}
											/>
										</FormGroup>
									</div>
								</ListGroupItemDnD>
							);
						})}
					</ListGroupDnD>
					<RaisedButton
						label="Add Tag"
						onClick={addTagBlock}
					/>
				</FormGroup>
			</div>
		);
	}
}

export default AddTagInput;
