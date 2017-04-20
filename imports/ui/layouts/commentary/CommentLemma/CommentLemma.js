import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { Sticky } from 'react-sticky';
import { createContainer } from 'meteor/react-meteor-data';

// api:
import TextNodes from '/imports/collections/textNodes'; // eslint-disable-line import/no-absolute-path

// components:
import CommentLemmaText from '/imports/ui/components/commentary/commentGroups/CommentLemmaText'; // eslint-disable-line import/no-absolute-path
import CommentGroupMeta from '/imports/ui/components/commentary/commentGroups/CommentGroupMeta';  // eslint-disable-line import/no-absolute-path

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
		};

		// methods:
		this.toggleEdition = this.toggleEdition.bind(this);
		this.showContextPanel = this.showContextPanel.bind(this);
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

	render() {
		const { commentGroup, hideLemma, editions, ready } = this.props;
		const { selectedLemmaEditionIndex } = this.state;

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
					{!ready ?
						<div className="lemma-loading">
							<div className="lemma-loading-top" />
							<div className="lemma-loading-bottom" />
						</div>
					:
						<CommentLemmaText
							lines={selectedLemmaEdition.lines}
						/>
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
		editions,
		ready: handle.ready(),
	};

}, CommentLemma);
