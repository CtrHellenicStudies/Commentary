import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import AvatarIcon from '/imports/avatar/client/ui/AvatarIcon.jsx';
import { Sticky } from 'react-sticky';
import TextNodes from '/imports/collections/textNodes';

import CommentLemmaText from './CommentLemmaText.jsx';

CommentLemma = React.createClass({

	propTypes: {
		commentGroup: React.PropTypes.object.isRequired,
		showContextPanel: React.PropTypes.func.isRequired,
		scrollPosition: React.PropTypes.func.isRequired,
		index: React.PropTypes.number,
		hideLemma: React.PropTypes.bool.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			selectedLemmaEditionIndex: 0,
		};
	},

	getMeteorData() {
		const commentGroup = this.props.commentGroup;
		const lemmaQuery = {
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

		console.log('lemmaQuery', lemmaQuery);

		const handle = Meteor.subscribe('textNodes', lemmaQuery);
		const textNodes = TextNodes.find(lemmaQuery).fetch();
		const editions = [];

		let textIsInEdition = false;
		textNodes.forEach((textNode) => {
			textNode.text.forEach((text) => {
				textIsInEdition = false;

				editions.forEach((edition) => {
					if (text.edition.slug === edition.slug) {
						edition.lines.push({
							html: text.html,
							n: text.n,
						});
						textIsInEdition = true;
					}
				});

				if (!textIsInEdition) {
					editions.push({
						title: text.edition.title,
						slug: text.edition.slug,
						lines: [
							{
								html: text.html,
								n: text.n,
							},
						],
					});
				}
			});
		});

		return {
			editions,
			ready: handle.ready(),
		};
	},

	toggleEdition(editionSlug) {
		const { editions } = this.data;
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
	},

	showContextPanel(commentGroup) {
		const scroll = $(`#comment-group-${this.props.index}`).offset().top;
		this.props.scrollPosition(scroll, this.props.index);
		this.props.showContextPanel(commentGroup);
	},

	render() {
		const self = this;
		const { commentGroup, hideLemma } = this.props;
		const { editions, ready } = this.data;

		const selectedLemmaEdition = editions[this.state.selectedLemmaEditionIndex] || { lines: [] };
		let workTitle = commentGroup.work.title;
		if (workTitle === 'Homeric Hymns') {
			workTitle = 'Hymns';
		}

		selectedLemmaEdition.lines.sort(Utils.sortBy('subwork.n', 'n'));
		console.log('editions', editions);

		return (
			<div className="comment-outer comment-lemma-comment-outer">
				<Sticky
					bottomOffset={250}
				>
					<div className="comment-group-meta">
						{hideLemma === false ?
							<div className="comment-group-meta-inner comment-group-meta-ref">
								<div className="comment-group-ref">
									<span className="comment-group-ref-above">
										{workTitle} {commentGroup.subwork.title}
									</span>
									<h2 className="comment-group-ref-below">
										{commentGroup.lineFrom}{commentGroup.lineTo ? `-${commentGroup.lineTo}` : '' }
									</h2>

								</div>
								<div className="comment-group-commenters">

									{commentGroup.commenters.map((commenter, i) => (
										<div
											key={i}
											className="comment-author"
											data-commenter-id={commenter.id}
										>
											<span className="comment-author-name">
												{commenter.name}
											</span>
											<a
												className="comment-author-image-wrap paper-shadow"
												href={`/commenters/${commenter.slug}`}
												onClick={self.goToAuthorComment}
											>
												<AvatarIcon
													avatar={
														(commenter && 'avatar' in commenter) ?
														commenter.avatar.src
														: null
													}
												/>
											</a>
										</div>
									))}
								</div>
							</div>
						: '' }
					</div>
				</Sticky>

				<article className="comment lemma-comment paper-shadow">
					{!ready ?
						<div className="lemma-loading">
							<div className="lemma-loading-top" />
							<div className="lemma-loading-bottom" />
						</div>
					: ''}
					<CommentLemmaText
						lines={selectedLemmaEdition.lines}
					/>
					<div className="edition-tabs tabs">
						{editions.map((lemmaTextEdition, i) => {
							const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 41);

							return (<RaisedButton
								key={i}
								label={lemmaEditionTitle}
								data-edition={lemmaTextEdition.title}
								className={selectedLemmaEdition.slug === lemmaTextEdition.slug ?
									'edition-tab tab selected-edition-tab' : 'edition-tab tab'}
								onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
							/>);
						})}
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
	},

});
