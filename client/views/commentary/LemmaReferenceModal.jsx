
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

LemmaReferenceModal = React.createClass({

	propTypes: {
		commentGroup: React.PropTypes.object.isRequired,
	},

	getInitialState(){
		return {
			selectedLemmaEdition: {lines:[]}

		}

	},

	mixins: [ReactMeteorData],

	getMeteorData(){
		const commentGroup = this.props.commentGroup;
		let lemmaQuery = {
					'work.slug' : commentGroup.work.slug,
					'subwork.n' : commentGroup.subwork.n,
					'text.n' : {
						$gte: commentGroup.lineFrom,
					}
				};
		let lemmaText = [];

		if(typeof commentGroup.lineTo !== "undefined"){
			lemmaQuery['text.n'].$lte = commentGroup.lineTo;

		}else {
			lemmaQuery['text.n'].$lte = commentGroup.lineFrom;

		}

		var handle2 = Meteor.subscribe('textNodes', lemmaQuery);
		if (handle2.ready()) {
			//console.log("lemmaQuery", lemmaQuery);
			var textNodes = TextNodes.find(lemmaQuery).fetch();
			var editions = [];

			var textIsInEdition = false;
			textNodes.forEach(function(textNode){

				textNode.text.forEach(function(text){
					textIsInEdition = false;

					editions.forEach(function(edition){

						if(text.edition.slug === edition.slug){
							edition.lines.push({
								html: text.html,
								n: text.n
							});
							textIsInEdition = true;

						}

					})

					if(!textIsInEdition){
						editions.push({
							title : text.edition.title,
							slug : text.edition.slug,
							lines : [
								{
									html: text.html,
									n: text.n
								}
							],
						})

					}

				});

			});

			lemmaText = editions;
		}

		return {
			lemmaText
		}

	},

	componentDidUpdate(){
		if(this.data.lemmaText.length && this.state.selectedLemmaEdition.lines.length === 0){
			this.setState({
				selectedLemmaEdition: this.data.lemmaText[0]
			});
		}

	},

	toggleEdition(editionSlug){
		if(this.state.selectedLemmaEdition.slug !== editionSlug){
			var newSelectedEdition = {};
			this.data.lemmaText.forEach(function(edition){
					if(edition.slug === editionSlug){
						newSelectedEdition = edition;
					}
			});

			this.setState({
				selectedLemmaEdition: newSelectedEdition
			});

		}

	},

	render() {
		var self = this;
		var commentGroup = this.props.commentGroup;
		var lemmaText = this.data.lemmaText;

		return (
			<div className="lemma-reference-modal">
					<article className="comment	lemma-comment paper-shadow " layout="column">

							{this.state.selectedLemmaEdition.lines.map(function(line, i){
								return <p
													key={i}
													className="lemma-text"
													dangerouslySetInnerHTML={{ __html: line.html}}
													></p>

							})}

							<div className="edition-tabs tabs">
								{lemmaText.map(function(lemmaTextEdition, i){
									let lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

									return <RaisedButton
										key={i}
										label={lemmaEditionTitle}
										data-edition={lemmaTextEdition.title}
										className={self.state.selectedLemmaEdition.slug ===	lemmaTextEdition.slug ? "edition-tab tab selected-edition-tab" : "edition-tab tab"}
										onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
										>

									</RaisedButton>

								})}
							</div>

							<i className="mdi mdi-close paper-shadow" onClick={this.closeLemmaReference} />
					</article>

			</div>

		 );
	 }

});
