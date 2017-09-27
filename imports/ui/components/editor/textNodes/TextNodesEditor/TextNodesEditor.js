import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createContainer } from 'meteor/react-meteor-data';
import Select from 'react-select';
import autoBind from 'react-autobind';
import {
	ControlLabel,
	FormGroup,
	FormControl,
} from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

// actions
import * as textNodesActions from '/imports/actions/textNodes';

// api:
import Editions from '/imports/models/editions';
import TextNodes from '/imports/models/textNodes';
import Works from '/imports/models/works';

// lib:
import Utils from '/imports/lib/utils';

// components
import TextNodesInput from '../TextNodesInput';
import EditWorkDialog from '../EditWorkDialog';
import EditEditionDialog from '../EditEditionDialog';
import EditSubworkDialog from '../EditSubworkDialog';
import TranslationSelect from '../TranslationSelect/TranslationSelect';
import TranslationNodeInput from '../TranslationNodeInput/TranslationNodeInput';


class TextNodesEditor extends React.Component {
	constructor(props) {
		super(props);

		const selectedWork = null;
		const selectedEdition = null;
		const selectedSubwork = null;
		const selectedTranslation = null;
		const subworks = [];
		const startAtLine = null;
		const limit = 50;

		this.state = {
			subworks,
			selectedWork,
			selectedEdition,
			selectedSubwork,
			selectedTranslation,
			startAtLine,
			limit,
			editWorkDialogOpen: false,
			editEditionDialogOpen: false,
			editSubworkDialogOpen: false,
		};

		autoBind(this);
	}

	selectWork(selectedWork) {
		const { works } = this.props;
		let _selectedWork;

		works.forEach(work => {
			if (work._id === selectedWork.value) {
				_selectedWork = work;
			}
		});

		this.setState({
			selectedWork: selectedWork.value,
			subworks: _selectedWork.subworks.sort(Utils.sortBy('n')),
		});
	}

	selectEdition(selectedEdition) {
		this.setState({
			selectedEdition: selectedEdition.value,
		});
	}

	selectSubwork(selectedSubwork) {
		this.setState({
			selectedSubwork: selectedSubwork.value,
		});
	}

	selectTranslation(selectedTranslation) {
		this.setState({
			selectedTranslation: selectedTranslation
		});
	}

	showEditWorkDialog() {
		this.setState({
			editWorkDialogOpen: true,
		});
	}

	showEditEditionDialog() {
		this.setState({
			editEditionDialogOpen: true,
		});
	}

	showEditSubworkDialog() {
		this.setState({
			editSubworkDialogOpen: true,
		});
	}

	handleCloseEditWorkDialog() {
		this.setState({
			editWorkDialogOpen: false,
		});
	}

	handleCloseEditEditionDialog() {
		this.setState({
			editEditionDialogOpen: false,
		});
	}

	handleCloseEditSubworkDialog() {
		this.setState({
			editSubworkDialogOpen: false,
		});
	}

	updateStartAtLine(e, newValue) {
		this.setState({
			startAtLine: newValue,
		});
	}

	loadMoreText() {
		this.setState({
			limit: this.state.limit + 50,
		});
	}

	renderTextNodesInput() {
		const { subworks, selectedWork, selectedEdition, selectedSubwork, startAtLine, limit } = this.state;

		if (!selectedWork || !selectedEdition || !selectedSubwork || typeof startAtLine === 'undefined' || startAtLine === null) {
			return null;
		}

		const { works, editions } = this.props;
		let _selectedWork;
		let _selectedEdition;
		let _selectedSubwork;

		works.forEach(work => {
			if (work._id === selectedWork) {
				_selectedWork = work;
				_selectedWork.subworks.forEach(subwork => {
					if (subwork.n === selectedSubwork) {
						_selectedSubwork = subwork;
					}
				});
			}
		});

		editions.forEach(edition => {
			if (edition._id === selectedEdition) {
				_selectedEdition = edition;
			}
		});

		return (
			<TextNodesInput
				workId={_selectedWork._id}
				workSlug={_selectedWork.slug}
				editionId={_selectedEdition._id}
				subworkN={_selectedSubwork.n}
				subworkTitle={selectedSubwork.title}
				lineFrom={startAtLine}
				limit={limit}
				loadMore={this.loadMoreText}
			/>
		);
	}

	renderTranslationNodesInput() {
		const { selectedWork, selectedSubwork, startAtLine, limit, selectedTranslation } = this.state;

		if (!selectedWork || !selectedSubwork || typeof startAtLine === 'undefined' || startAtLine === null || !selectedTranslation) {
			return null;
		}
		return (
			<TranslationNodeInput
				selectedWork={selectedWork}
				selectedSubwork={selectedSubwork}
				startAtLine={startAtLine}
				limit={limit}
				selectedTranslation={selectedTranslation}
				loadMore={this.loadMoreText}
			/>
		);
	}

	render() {
		const { works, editions } = this.props;
		const { subworks, selectedWork, selectedEdition, selectedSubwork, startAtLine } = this.state;

		let _selectedWork;
		let _selectedEdition;
		let _selectedSubwork;

		works.forEach(work => {
			if (work._id === selectedWork) {
				_selectedWork = work;
				_selectedWork.subworks.forEach(subwork => {
					if (subwork.n === selectedSubwork) {
						_selectedSubwork = subwork;
					}
				});
			}
		});

		editions.forEach(edition => {
			if (edition._id === selectedEdition) {
				_selectedEdition = edition;
			}
		});

		const workOptions = [];
		works.map(work => {
			workOptions.push({
				value: work._id,
				label: work.title,
			});
		});

		const editionOptions = [];
		editions.map(edition => {
			editionOptions.push({
				value: edition._id,
				label: edition.title,
			});
		});

		const subworkOptions = [];
		subworks.map(subwork => {
			subworkOptions.push({
				value: subwork.n,
				label: subwork.title,
			});
		});

		const translationOptions = {
			selectedWork,
			selectedSubwork,
		};


		return (
			<div className="text-nodes-editor paper-shadow">
				<div className="text-nodes-editor-meta-inputs">
					<div className="text-nodes-editor-meta-input work-input">
						<FormGroup controlId="formControlsSelect">
							<ControlLabel>Work</ControlLabel>
							<Select
								name="work-select"
								value={selectedWork}
								options={workOptions}
								onChange={this.selectWork}
							/>
							{/*
							<button
								onClick={this.showEditWorkDialog}
							>
								Add new work
							</button>
							{selectedWork ?
								<button
									onClick={this.showEditWorkDialog}
								>
									Edit {_selectedWork.title}
								</button>
							: ''}
							*/}
						</FormGroup>
					</div>
					<div className="text-nodes-editor-meta-input edition-input">
						<FormGroup controlId="formControlsSelect">
							<ControlLabel>Edition</ControlLabel>
							<Select
								name="edition-select"
								value={selectedEdition}
								options={editionOptions}
								onChange={this.selectEdition}
							/>
							{/*
							<button
								onClick={this.showEditEditionDialog}
							>
								Add new edition
							</button>
							{selectedEdition ?
								<button
									onClick={this.showEditEditionDialog}
								>
									Edit {Utils.trunc(_selectedEdition.title, 30)}
								</button>
							: ''}
							*/}
						</FormGroup>
					</div>
					<div className="text-nodes-editor-meta-input subwork-input">
						<FormGroup controlId="formControlsSelect">
							<ControlLabel>Subwork (Book/Poem/Rhapsody/etc)</ControlLabel>
							<Select
								name="subwork-select"
								value={selectedSubwork}
								options={subworkOptions}
								onChange={this.selectSubwork}
							/>
							{/*
							<button
								onClick={this.showEditSubworkDialog}
							>
								Add new subwork
							</button>
							{selectedSubwork ?
								<button
									onClick={this.showEditSubworkDialog}
								>
									Edit {_selectedSubwork.title}
								</button>
							: ''}
							*/}
						</FormGroup>
					</div>
					<div className="text-nodes-editor-meta-input line-from-input">
						<FormGroup controlId="formControlsSelect">
							<ControlLabel>Start at line</ControlLabel>
							<br />
					    <TextField
					      hintText="0"
								onChange={this.updateStartAtLine}
					    />
						</FormGroup>
					</div>
					<TranslationSelect {...translationOptions} selectTranslation={this.selectTranslation} />

				</div>

				{
					this.state.selectedTranslation ? (
						<div className="row">
							<div className="col-lg-6">{this.renderTextNodesInput()}</div>
							<div className="col-lg-6">{this.renderTranslationNodesInput()}</div>
						</div>) : this.renderTextNodesInput()
				}

				<EditWorkDialog
					open={this.state.editWorkDialogOpen}
					handleClose={this.handleCloseEditWorkDialog}
					work={_selectedWork}
				/>
				<EditEditionDialog
					open={this.state.editEditionDialogOpen}
					handleClose={this.handleCloseEditEditionDialog}
					edition={_selectedEdition}
				/>
				<EditSubworkDialog
					open={this.state.editSubworkDialogOpen}
					handleClose={this.handleCloseEditSubworkDialog}
					subwork={_selectedSubwork}
				/>
			</div>
		);
	}
}

const TextNodesEditorContainer = createContainer(props => {

	Meteor.subscribe('editions');
	const editions = Editions.find().fetch();

	Meteor.subscribe('works', Session.get('tenantId'));
	const works = Works.find().fetch();

	return {
		works,
		editions,
	};

}, TextNodesEditor);

/*
const mapStateToProps = (state, props) => ({
	textNodes: state.textNodes.textNodes,
	work: state.textNodes.work,
	subwork: state.textNodes.subwork,
	edition: state.textNodes.edition,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(textNodesActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextNodesEditorContainer);
*/

export default TextNodesEditorContainer;
