// private component:
import ContextPanelContent from './ContextPanelContent';


class ContextPanel extends React.Component {
	static propTypes = {
		open: React.PropTypes.bool.isRequired,
		commentGroup: React.PropTypes.shape({
			work: React.PropTypes.shape({
				slug: React.PropTypes.string.isRequired,
			}),
			subwork: React.PropTypes.shape({
				n: React.PropTypes.number.isRequired,
			}),
			lineFrom: React.PropTypes.number.isRequired,
			lineTo: React.PropTypes.number,
			ref: React.PropTypes.string.isRequired,
		}).isRequired,
		closeContextPanel: React.PropTypes.func.isRequired,
		scrollPosition: React.PropTypes.number.isRequired,
		commentLemmaIndex: React.PropTypes.number.isRequired,
	}

	constructor(props) {
		super(props);

		const commentGroup = props.commentGroup;
		const lineFrom = commentGroup.lineFrom;

		this.state = {
			selectedLemmaEdition: '',
			lineFrom,
			maxLine: 0,
			highlightingVisible: true,
		};

		this.setMaxLine();

		// methods:
		this.onAfterClicked = this.onAfterClicked.bind(this);
		this.onBeforeClicked = this.onBeforeClicked.bind(this);
		this.toggleEdition = this.toggleEdition.bind(this);
		this.toggleHighlighting = this.toggleHighlighting.bind(this);
		this.scrollElement = this.scrollElement.bind(this);
		this.setMaxLine = this.setMaxLine.bind(this);
	}

	componentDidMount() {
		this.scrollElement('open');
	}

	componentDidUpdate(prevProps, prevState) {
		const isLemmaEditionChange = prevState.selectedLemmaEdition !== this.state.selectedLemmaEdition;
		const isHighlightingChange = prevState.highlightingVisible !== this.state.highlightingVisible;
		if (!(isLemmaEditionChange || isHighlightingChange)) {
			this.scrollElement('open');
		}
	}

	onAfterClicked() {
		if ((this.state.lineFrom + 49) <= this.state.maxLine) {
			this.setState({
				lineFrom: this.state.lineFrom + 25,
			});
		}
	}

	onBeforeClicked() {
		if (this.state.lineFrom !== 1) {
			this.setState({
				lineFrom: this.state.lineFrom - 25,
			});
		}
	}

	setMaxLine() {
		const { commentGroup } = this.props;
		Meteor.call('getMaxLine', commentGroup.work.slug,
			commentGroup.subwork.n, (err, res) => {
				if (err) throw new Meteor.Erorr(err);
				this.setState({
					maxLine: res,
				});
			}
		);
	}

	toggleEdition(editionSlug) {
		if (this.state.selectedLemmaEdition !== editionSlug) {
			this.setState({
				selectedLemmaEdition: editionSlug,
			});
		}
	}

	toggleHighlighting() {
		this.setState({
			highlightingVisible: !this.state.highlightingVisible,
		});
	}

	scrollElement(state) {
		switch (state) {
		case 'open':
			window.requestAnimationFrame(() => {
				setTimeout(() => {
					const scroll = $(`#comment-group-${this.props.commentLemmaIndex}`).offset().top;
					$(document).scrollTop(scroll);
				}, 300);
			});
			break;
		case 'close':
			window.requestAnimationFrame(() => {
				setTimeout(() => {
					$(document).scrollTop(this.props.scrollPosition);
				}, 1000);
			});
			break;
		default:
			break;
		}
	}

	render() {

		const { open, closeContextPanel, commentGroup } = this.props;
		const { highlightingVisible, lineFrom, maxLine, selectedLemmaEdition } = this.state;

		return (
			<ContextPanelContent
				open={open}
				closeContextPanel={closeContextPanel}
				commentGroup={commentGroup}
				highlightingVisible={highlightingVisible}
				lineFrom={lineFrom}
				maxLine={maxLine}
				selectedLemmaEdition={selectedLemmaEdition}
				onBeforeClicked={this.onBeforeClicked}
				onAfterClicked={this.onAfterClicked}
				toggleEdition={this.toggleEdition}
				toggleHighlighting={this.toggleHighlighting}
			/>
		);
	}
}

export default ContextPanel;
