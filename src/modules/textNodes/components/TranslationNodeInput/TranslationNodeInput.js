import React from 'react';
import PropTypes from 'prop-types';
import {
	FormGroup,
} from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import { debounce } from 'throttle-debounce';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

// components
import { ListGroupDnD, createListGroupItemDnD } from '../../../shared/components/ListDnD/ListDnD';
import SnackbarContainer from '../../../snackBar/containers/SnackbarContainer';


const ListGroupItemDnD = createListGroupItemDnD('translationNodeBlocks');


function getTranslationQueries(query, filter) {
	if (query.loading) {
		return [];
	}
	return query.translations.filter(x =>
		x.tenantId === filter.tenantId &&
		x.work === filter.work &&
		parseInt(x.subwork, 10) === parseInt(filter.subwork, 10) &&
		x.author === filter.author)
		.sort(function(a, b) {
			return parseInt(a.n, 10) - parseInt(b.n, 10);
		})
		.slice(filter.skip, filter.limit);
}

class TranslationNodeInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			translationNodes: [],
			snackbarOpen: false,
			snackbarMessage: '',
			inserting: false,
		};
		this.onChangeText = this.onChangeText.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
		this.moveTextNodeBlock = this.moveTextNodeBlock.bind(this);
	}

	componentWillReceiveProps(props) {
		const {
			selectedWork, selectedSubwork, startAtLine, limit, selectedTranslation,
		} = props;
		const { tenantId } = this.props;
		const filter = {
			tenantId,
			work: selectedWork.slug,
			subwork: selectedSubwork,
			skip: startAtLine - 1,
			limit,
			author: selectedTranslation
		};

		const translation = getTranslationQueries(props.translationsQuery, filter);

		const translationNodes = translation;
		if (!translation || translation.length === 0) {
			for (let i = 0; i < limit; i++) {
				let newLine;
				const arrIndex = _.findIndex(translation, (line) => line.n === i + parseInt(startAtLine, 10));

				if (arrIndex >= 0) {
					newLine = translation[arrIndex];
				}		else {
					newLine = {
						n: i + parseInt(startAtLine, 10),
						text: '',
						tenantId: tenantId,
						work: selectedWork.slug,
						subwork: selectedSubwork,
						author: selectedTranslation,
					};
				}

				translationNodes.push(newLine);
			}
		}

		this.setState({
			translationNodes: translationNodes,
			ready: !props.translationsQuery.loading
		});
	}

	onChangeText(event, newValue) {
		const index = parseInt(event.target.name.replace('_text', ''), 10);
		const currentTranslationNode = this.state.translationNodes[index];
		const updatedObject = Object.assign({}, currentTranslationNode);
		updatedObject.text = newValue;
		delete updatedObject.__typename;
		if (newValue && !this.state.inserting) {
			this.setState({
				inserting: true
			});

			debounce(500, () => {
				this.props.translationUpdate(updatedObject).then((res) => {
					if (res.data) {
						this.setState({
							inserting: false
						});
						this.showSnackBar('Updated');
					} else {
						this.showSnackBar('Error');
					}
				});
			})();
		} else if (!newValue && !this.state.inserting) {
			this.setState({
				inserting: true
			});
			debounce(500, () => {
				this.props.translationRemove(currentTranslationNode._id).then((err, res) => {
					if (err) {
						console.error('Error removing text', err);
						this.showSnackBar(err.message);
					} else {
						this.showSnackBar('Deleted');
						this.setState({
							inserting: false
						});
					}
				});
			})();
		}
	}

	moveTextNodeBlock() {
		// TODO implement moving text node block

	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
	}

	render() {
		const {translationNodes} = this.state;

		if (!this.state.ready) {
			return null;
		}

		return (
			<FormGroup
				controlId="textNodes"
				className="text-nodes-editor-text-input"
			>
				<ListGroupDnD>
					{translationNodes.map((translationNode, i) => (
						<ListGroupItemDnD
							key={`${translationNode.author.replace(' ', '')}${i}`}
							index={i}
							className="form-subitem form-subitem--textNode text-node-input"
							moveListGroupItem={this.moveTextNodeBlock}
						>
							<div
								className="reference-work-item"
							>
								<FormGroup className="text-node-number-input">
									<TextField
										name={`${i}_number`}
										hintText="0"
										defaultValue={translationNode.n}
										style={{
											width: '40px',
											margin: '0 10px',
										}}
										onChange={this.onChangeN}
										disabled
									/>
								</FormGroup>
								<FormGroup className="text-node-text-input">
									<TextField
										name={`${i}_text`}
										defaultValue={translationNode.text}
										style={{
											width: '700px',
											margin: '0 10px',
										}}
										onChange={this.onChangeText}
									/>
								</FormGroup>
							</div>
						</ListGroupItemDnD>
					))}
				</ListGroupDnD>
				<SnackbarContainer />
			</FormGroup>
		);
	}
}

TranslationNodeInput.propTypes = {
	translationRemove: PropTypes.func,
	translationUpdate: PropTypes.func,
	translationsQuery: PropTypes.object,
	startAtLine: PropTypes.number,
	selectedSubwork: PropTypes.number,
	selectedWork: PropTypes.object,
	limit: PropTypes.number,
	selectedTranslation: PropTypes.string
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
)(TranslationNodeInput);

// TODO

// export default compose(
// 	translationsQuery,
// 	translationRemoveMutation,
// 	translationUpdateMutation
// )(TranslationNodeInput);
