import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { Sticky } from 'react-sticky';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
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
		commentGroup: PropTypes.shape({
			work: PropTypes.shape({
				slug: PropTypes.string.isRequired,
				title: PropTypes.string.isRequired,
			}),
			subwork: PropTypes.shape({
				n: PropTypes.number.isRequired,
			}),
			lineFrom: PropTypes.number.isRequired,
			lineTo: PropTypes.number,
			commenters: PropTypes.arrayOf(PropTypes.shape({
				_id: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
				slug: PropTypes.string.isRequired,
				avatar: PropTypes.shape({
					src: PropTypes.string,
				})
			}))
		}).isRequired,
		showContextPanel: PropTypes.func.isRequired,
		setScrollPosition: PropTypes.func.isRequired,
		index: PropTypes.string.isRequired,
		hideLemma: PropTypes.bool.isRequired,
		translationAuthors: PropTypes.array,

		// from createContainer:
		editions: PropTypes.arrayOf(PropTypes.shape({
			title: PropTypes.string.isRequired,
			slug: PropTypes.string.isRequired,
		})),
		ready: PropTypes.bool,
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
			translationMenuOpen: false,
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

		if (!selectedAuthor) {
			this.setState({
				selectedAuthor: value,
				showTranslation: true,
				translationsMenuOpen: false,
			});
		} else if (selectedAuthor === value) {
			this.setState({
				showTranslation: !showTranslation,
				translationsMenuOpen: false,
			});
		} else if (selectedAuthor !== value) {
			this.setState({
				selectedAuthor: value,
				showTranslation: true,
				translationsMenuOpen: false,
			});
		}
	}

	handleOpenTranslationMenu(event) {
    // This prevents ghost click.
		event.preventDefault();

		const { translationsMenuOpen } = this.state;

		this.setState({
			translationsMenuOpen: !translationsMenuOpen,
			anchorEl: event.currentTarget,
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
					{translationAuthors.length > 0 && !showTranslation ?
						<div className="translation-available-flag">
							<i className="mdi mdi-comment-alert" />
							<label className="translation-available-label">
								{translationAuthors.length === 1 ?
									'A commentator has translated this passage'
								:
									`${translationAuthors.length} commentators have translated this passage`
								}
							</label>
						</div>
					:
						''
					}
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

						{translationAuthors.length > 0 ?
							<RaisedButton
								onTouchTap={this.handleOpenTranslationMenu}
								label="Translation"
								className={`edition-tab tab translation-tab ${showTranslation} ? 'translation-tab--active' : ''}`}
							/>
						: ''}
						<Popover
							open={this.state.translationsMenuOpen}
							anchorEl={this.state.anchorEl}
							anchorOrigin={{
								horizontal: 'left',
								vertical: 'bottom',
							}}
							targetOrigin={{
								horizontal: 'left',
								vertical: 'top',
							}}
							onRequestClose={this.handleRequestClose}
							animation={PopoverAnimationVertical}
						>
							<Menu
								onChange={this.handleAuthorChange}
								className="translation-author-menu"
							>
								{translationAuthors.map((author, i) => (
									<MenuItem
										key={`${author}-${i}`}
										value={author}
										primaryText={author}
										className="translation-author-menu-item"
										style={{
											fontFamily: '"Proxima Nova A W07 Light", sans-serif',
											fontSize: '12px',
										}}
									/>
								))}
							</Menu>
						</Popover>
					</div>
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
	let translationAuthors = [];

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

		const translationHandle = Meteor.subscribe('translations', Session.get('tenantId'));

		if (!commentGroup.lineTo) {
			// console.log('Didn\'t find a lineTo!');
			commentGroup.lineTo = commentGroup.lineFrom;
		}

		const translationQuery = {
			work: commentGroup.work.slug,
			subwork: Number(commentGroup.subwork.title),
			lineTo: {$gte: commentGroup.lineTo},
			lineFrom: {$lte: commentGroup.lineFrom},
		};

		translationAuthors = Translations.find(translationQuery).fetch().map(translation => translation.author);
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

	return {
		translationAuthors,
		editions,
		ready: handle.ready(),
	};

}, CommentLemma);
