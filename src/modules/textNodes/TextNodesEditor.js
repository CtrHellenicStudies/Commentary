import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import Select from 'react-select';
import autoBind from 'react-autobind';
import {
	ControlLabel,
	FormGroup,
} from 'react-bootstrap';
import TextField from 'material-ui/TextField';

// graphql
import { editionsQuery } from '../../graphql/methods/editions';


// lib:
import Utils from '../../lib/utils';

// components
import TextNodesInput from './input/TextNodesInput';
import EditWorkDialog from './dialog/EditWorkDialog';
import EditEditionDialog from './dialog/EditEditionDialog';
import EditSubworkDialog from './dialog/EditSubworkDialog';
import MultilineDialog from './multiline/MultilineDialog';
import TranslationSelect from '../translations/select/TranslationSelect';
import TranslationNodeInput from '../translations/input/TranslationNodeInput';


class TextNodesEditor extends Component {
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
			works: [],
			editions: [],
			editWorkDialogOpen: false,
			editEditionDialogOpen: false,
			editSubworkDialogOpen: false,
			multiLineDialogOpen: false
		};
		autoBind(this);
	}
	componentWillReceiveProps(props) {
		if (props.editionsQuery.loading) {
				return;
		}
		const editions = props.editionsQuery.collections[0].textGroups[0].works;
		const works = Utils.worksFromEditions(editions);
		this.setState({
			works,
			editions
		});
	}
	selectWork(event) {
		const setValue = event ? event.value : '';

		const { works } = this.state;
		let editionsAvailable = [];
		let _selectedWork;
		works.forEach(work => {
			if (work.id === setValue) {
				_selectedWork = work;
			}
		});
		this.state.editions.forEach(function(edition) {
			if (edition.urn === _selectedWork.urn) {
				editionsAvailable.push(edition);
			}
		});
		this.setState({
			selectedWork: setValue,
			editionsAvailable: editionsAvailable
		//	subworks: _selectedWork
		});
	}

	selectEdition(event) {
		const setValue = event ? event.value : '';
		this.setState({
			selectedEdition: setValue
		});
	}

	selectSubwork(event) {
		const setValue = event ? event.value : '';
		this.setState({
			selectedSubwork: setValue
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

	showMultilineDialog() {

		this.setState({
			multiLineDialogOpen: true,
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

	handleCloseMultilineDialog() {
		this.setState({
			multiLineDialogOpen: false,
		});
	}

	updateStartAtLine(e, newValue) {
		this.setState({
			startAtLine: parseInt(newValue, 10),
		});
	}

	loadMoreText() {
		this.setState({
			limit: this.state.limit + 50,
		});
	}

	renderTextNodesInput() {
		const { selectedWork, selectedEdition, selectedSubwork, startAtLine, limit } = this.state;

		if (!selectedWork || !selectedEdition || !selectedSubwork || typeof startAtLine === 'undefined' || startAtLine === null) {
			return null;
		}

		const { works, editions } = this.state;
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
				lineFrom={parseInt(startAtLine, 10)}
				limit={parseInt(startAtLine, 10) + limit}
				loadMore={this.loadMoreText}
			/>
		);
	}

	renderTranslationNodesInput() {
		const { selectedWork, selectedSubwork, startAtLine, limit, selectedTranslation } = this.state;
		let _selectedWork;
		if (!selectedWork || !selectedSubwork || typeof startAtLine === 'undefined' || startAtLine === null || !selectedTranslation) {
			return null;
		}
		this.state.works.forEach(work => {
			if (work._id === selectedWork) {
				_selectedWork = work;
			}
		});
		return (
			<TranslationNodeInput
				selectedWork={_selectedWork}
				selectedSubwork={selectedSubwork}
				startAtLine={startAtLine}
				limit={limit}
				selectedTranslation={selectedTranslation}
				loadMore={this.loadMoreText}
			/>
		);
	}

	render() {
		const { works, editions } = this.state;
		const { subworks, selectedWork, selectedEdition, selectedSubwork } = this.state;
		let editionsAvailable = this.state.editionsAvailable ? this.state.editionsAvailable : editions;
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
			return true;
		});

		editions.forEach(edition => {
			if (edition._id === selectedEdition) {
				_selectedEdition = edition;
			}
			return true;
		});

		const workOptions = [];
		works.map(work => {
			workOptions.push({
				value: work.id,
				label: work.english_title,
			});
			return true;
		});

		const editionOptions = [];
		editionsAvailable.map(edition => {
			editionOptions.push({
				value: edition.id,
				label: edition.slug,
			});
			return true;
		});

		const subworkOptions = [];
		subworks.map(subwork => {
			subworkOptions.push({
				value: subwork.n,
				label: subwork.title,
			});
			return true;
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
					{_selectedEdition ?
						<div className="text-nodes-editor-meta-input">
							<FormGroup controlId="multiLineButton">
								<ControlLabel>Multiline</ControlLabel>
								<br />
								<button onClick={this.showMultilineDialog}>
								Manage multiline
							</button>
							</FormGroup>
						</div> : ''}
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
				{_selectedEdition ?
					<MultilineDialog
						open={this.state.multiLineDialogOpen}
						handleClose={this.handleCloseMultilineDialog}
						edition={_selectedEdition}
					/> : ''}
			</div>
		);
	}
}
TextNodesEditor.propTypes = {
	editionsQuery: PropTypes.object,
};
export default compose(
	editionsQuery
)(TextNodesEditor);
