import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { Sticky } from 'react-sticky';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import TextField from 'material-ui/TextField';

import Utils from '/imports/lib/utils';

// api:
import TextNodes from '/imports/api/collections/textNodes';
import Translations from '/imports/api/collections/translations';

// components:
import CommentLemmaText from '/imports/ui/components/commentary/commentGroups/CommentLemmaText';
import CommentGroupMeta from '/imports/ui/components/commentary/commentGroups/CommentGroupMeta';
import TranslationLayout from '/imports/ui/layouts/commentary/TranslationLayout';
import LoadingLemma from '/imports/ui/components/loading/LoadingLemma';

class CommentLemma extends React.Component {

	static propTypes = {
		commentGroup: React.PropTypes.shape({
			work: React.PropTypes.shape({
				slug: React.PropTypes.string.isRequired,
				title: React.PropTypes.string.isRequired,
			}),
			subwork: React.PropTypes.shape({
				n: React.PropTypes.number.isRequired,
			}),
			lineFrom: React.PropTypes.number.isRequired,
			lineTo: React.PropTypes.number,
			commenters: React.PropTypes.arrayOf(React.PropTypes.shape({
				_id: React.PropTypes.string.isRequired,
				name: React.PropTypes.string.isRequired,
				slug: React.PropTypes.string.isRequired,
				avatar: React.PropTypes.shape({
					src: React.PropTypes.string,
				})
			}))
		}).isRequired,
		showContextPanel: React.PropTypes.func.isRequired,
		setScrollPosition: React.PropTypes.func.isRequired,
		index: React.PropTypes.string.isRequired,
		hideLemma: React.PropTypes.bool.isRequired,

		// from createContainer:
		editions: React.PropTypes.arrayOf(React.PropTypes.shape({
			title: React.PropTypes.string.isRequired,
			slug: React.PropTypes.string.isRequired,
		})),
		ready: React.PropTypes.bool,
	};

	static defaultProps = {
		editions: null,
		ready: false,
	};

	constructor(props) {
		super(props);

		this.state = {
			selectedLemmaEditionIndex: 0,
			showTranslation: false,
		};

		// methods:
		this.toggleEdition = this.toggleEdition.bind(this);
		this.showContextPanel = this.showContextPanel.bind(this);
		this.handleAuthorChange = this.handleAuthorChange.bind(this);
		this.handleOpenTranslationMenu = this.handleOpenTranslationMenu.bind(this);
	}


	toggleEdition(editionSlug) {
		const { editions } = this.props;
		const { selectedLemmaEditionIndex } = this.state;

		if (editions && editions.length) {
			if (editions[selectedLemmaEditionIndex].slug !== editionSlug) {
				let newSelectedEditionIndex = 0;

				editions.forEach((edition, index) => {
					if (edition.slug === editionSlug) {
						newSelectedEditionIndex = index;
					}
				});

				this.setState({
					selectedLemmaEditionIndex: newSelectedEditionIndex,
				});
			}
		}
	}

	showContextPanel(commentGroup) {
		const { index, setScrollPosition, showContextPanel } = this.props;

		setScrollPosition(index);
		showContextPanel(commentGroup);
	}

	handleAuthorChange(event, value) {
		const { selectedAuthor, showTranslation } = this.state;

		console.log('handleAuthorChange fired. current state: ', selectedAuthor);

		if (!selectedAuthor) {
			this.setState({
				selectedAuthor: value,
				showTranslation: true,
				openTranslationMenu: false
			});
		} else if (selectedAuthor === value) {
			this.setState({
				showTranslation: !showTranslation,
				openTranslationMenu: false
			});
		} else if (selectedAuthor !== value) {
			this.setState({
				selectedAuthor: value,
				showTranslation: true,
				openTranslationMenu: false
			});
		}
	}

	handleOpenTranslationMenu() {
		const { openTranslationMenu } = this.state;

		this.setState({
			openTranslationMenu: !openTranslationMenu
		});
	}

	handleOpenEditionMenu() {
		const { openEditionMenu } = this.state;

		this.setState({
			openEditionMenu: !openEditionMenu
		});

	}


	render() {
		const { commentGroup, hideLemma, editions, ready, translationAuthors } = this.props;
		const { selectedLemmaEditionIndex, selectedAuthor, showTranslation } = this.state;

		const selectedLemmaEdition = editions[selectedLemmaEditionIndex] || { lines: [] };
		selectedLemmaEdition.lines.sort(Utils.sortBy('subwork.n', 'n'));

		let workTitle = commentGroup.work.title;
		if (workTitle === 'Homeric Hymns') {
			workTitle = 'Hymns';
		}

		return (
			<div className="comment-outer comment-lemma-comment-outer">
				<Sticky
					bottomOffset={250}
				>
					<CommentGroupMeta
						hideLemma={hideLemma}
						commentGroup={commentGroup}
					/>
				</Sticky>

				<article className="comment lemma-comment paper-shadow">
					<LoadingLemma ready={ready} />
					{ready ?
						<TranslationLayout
							commentGroup={commentGroup}
							showTranslation={showTranslation}
							lines={selectedLemmaEdition.lines}
							author={selectedAuthor}
						/>
						:
						''
					}
					{translationAuthors.length > 0 && !showTranslation ?
						<div className="translation-available-flag">
							<i className="mdi mdi-comment-alert" />
							<span className="translation-available-label">
								{translationAuthors.length === 1 ?
									`A commentator has translated this passage`
								:
									`${translationAuthors.length} commentators have translated this passage`
								}
							</span>
						</div>
					:
						''
					}
					<div className="edition-tabs tabs">
						{editions.map((lemmaTextEdition) => {
							const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 41);

							return (<RaisedButton
								key={lemmaTextEdition.slug}
								label={lemmaEditionTitle}
								data-edition={lemmaTextEdition.title}
								className={selectedLemmaEdition.slug === lemmaTextEdition.slug ?
									'edition-tab tab selected-edition-tab' : 'edition-tab tab'}
								onClick={this.toggleEdition.bind(null, lemmaTextEdition.slug)}
							/>);
						})}

					</div>
					{translationAuthors.length > 0 ?
						<div>
							<RaisedButton
								onClick={this.handleOpenTranslationMenu}
								label="Translations"
								labelPosition="before"
							>
								<div
									// open={this.state.openTranslationMenu}
									// onChange={this.handleAuthorChange}
								>
									{translationAuthors.map((author, i) => (
										<MenuItem
											key={i}
											value={author}
											primaryText={author}
										/>
									))}
								</div>
							</RaisedButton>
						</div>
					:
					''
					}
					<div className="context-tabs tabs">
						<RaisedButton
							className="context-tab tab"
							onClick={this.showContextPanel.bind(null, this.props.commentGroup)}
							label="Context"
							labelPosition="before"
							icon={<FontIcon className="mdi mdi-chevron-right" />}
						/>
					</div>
				</article>
				<div className="discussion-wrap" />
			</div>


		);
	}

}

export default createContainer(({ commentGroup }) => {

	let lemmaQuery = {};

	if (commentGroup) {
		lemmaQuery = {
			'work.slug': commentGroup.work.slug,
			'subwork.n': commentGroup.subwork.n,
			'text.n': {
				$gte: commentGroup.lineFrom,
			},
		};

		if (typeof commentGroup.lineTo !== 'undefined') {
			lemmaQuery['text.n'].$lte = commentGroup.lineTo;
		} else {
			lemmaQuery['text.n'].$lte = commentGroup.lineFrom;
		}
		if (lemmaQuery['work.slug'] === 'homeric-hymns') {
			lemmaQuery['work.slug'] = 'hymns';
		}
	}

	const handle = Meteor.subscribe('textNodes', lemmaQuery);
	const textNodes = TextNodes.find(lemmaQuery).fetch();
	const editions = [];

	let textIsInEdition = false;
	textNodes.forEach((textNode) => {
		textNode.text.forEach((text) => {
			textIsInEdition = false;

			editions.forEach((edition) => {
				if (text.edition.slug === edition.slug) {
					if (lemmaQuery['text.n'].$gte <= text.n && text.n <= lemmaQuery['text.n'].$lte) {
						edition.lines.push({
							html: text.html,
							n: text.n,
						});
					}
					textIsInEdition = true;
				}
			});

			if (!textIsInEdition) {
				const newEdition = {
					title: text.edition.title,
					slug: text.edition.slug,
					lines: [],
				};

				if (lemmaQuery['text.n'].$gte <= text.n && text.n <= lemmaQuery['text.n'].$lte) {
					newEdition.lines.push({
						html: text.html,
						n: text.n,
					});
				}

				editions.push(newEdition);
			}
		});
	});

	const translationHandle = Meteor.subscribe('translations', Session.get('tenantId'));

	const translationQuery = {
		work: commentGroup.work.slug,
		subwork: Number(commentGroup.subwork.title),
		lineTo: {$gte: commentGroup.lineTo},
		lineFrom: {$lte: commentGroup.lineFrom},
	};

	const translationAuthors = Translations.find(translationQuery).fetch().map(translation => translation.author);

	return {
		translationAuthors,
		editions,
		ready: handle.ready(),
	};

}, CommentLemma);
