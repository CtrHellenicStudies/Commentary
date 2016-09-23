import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

ContextPanel = React.createClass({

	propTypes: {
		open: React.PropTypes.bool.isRequired,
		commentGroup: React.PropTypes.object.isRequired,
		closeContextPanel: React.PropTypes.func.isRequired,
		scrollPosition: React.PropTypes.number.isRequired,
		commentLemmaIndex: React.PropTypes.number.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired
	},

	getInitialState() {
		return {
			selectedLemmaEdition : ""
		};
	},

	toggleEdition(editionSlug){
		if(this.state.selectedLemmaEdition !== editionSlug){
			this.setState({
				selectedLemmaEdition: editionSlug
			});

		}

	},


	mixins: [ReactMeteorData],

	getMeteorData(){

		var lemmaText = [];
		var commentGroup = this.props.commentGroup;
		var selectedLemmaEdition = {lines:[], slug:""};

		var lemmaQuery = {
					'work.slug' : commentGroup.work.slug,
					'subwork.n' : commentGroup.subwork.n,
					'text.n' : {
						$gte: commentGroup.lineFrom,
						$lte: commentGroup.lineFrom + 49
					}
				};

		var handle2 = Meteor.subscribe('textNodes', lemmaQuery);
		if (handle2.ready()) {
			//console.log("Context Panel lemmaQuery", lemmaQuery);
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

			if(this.state.selectedLemmaEdition.length){
				lemmaText.forEach(function(edition){
					if(edition.slug === this.state.selectedLemmaEdition){
						selectedLemmaEdition = edition;
					}
				});
			}else {
				selectedLemmaEdition = lemmaText[0];
			}

		}

		//console.log("Context Panel lemmaText", lemmaText);




		return {
			lemmaText: lemmaText,
			selectedLemmaEdition: selectedLemmaEdition
		};


	},

	scrollElement(state) {
				 var that = this;
				 switch (state) {
						 case 'open':
						 console.log('top', $('#comment-group-' + that.props.commentLemmaIndex).offset().top);
								 window.requestAnimationFrame(function() {
										 var scroll = $('#comment-group-' + that.props.commentLemmaIndex).offset().top;
										 $(document).scrollTop(scroll);
								 });
								 break;
						 case 'close':
								window.requestAnimationFrame(function() {
								 	console.log('that.props.scrollPosition', that.props.scrollPosition);
								 	setTimeout(function(){
								 		$(document).scrollTop(that.props.scrollPosition);
								 	}, 1000);
								});
								break;
				 }
		 },

		 componentDidMount() {
				 this.scrollElement('open');
		 },

		 componentDidUpdate(prevProps, prevState) {
				this.scrollElement('open');
		 },

		 componentWillUnmount() {
		 	this.scrollElement('close');
		 },


	render() {
		var self = this;
		var contextPanelStyles = "lemma-panel paper-shadow";

		if(this.props.open){
			contextPanelStyles += " extended";
		}

		return (
			<div className={contextPanelStyles}>

				<IconButton
					className="close-lemma-panel"
					onClick={this.props.closeContextPanel}
					iconClassName="mdi mdi-close"
					>

				</IconButton>

				<div className="lemma-text-wrap">
					{this.data.selectedLemmaEdition.lines.map(function(line, i){
						var lineClass="lemma-line";
						var lineFrom = self.props.commentGroup.lineFrom;
						var lineTo;

						if(typeof self.props.commentGroup.lineTo !== "undefined"){
								lineTo = self.props.commentGroup.lineTo;
						}else {
								lineTo = self.props.commentGroup.lineFrom;
						}

						if(lineFrom <= line.n && line.n <= lineTo){
							lineClass += " highlighted";
						}

						return <div
							className={lineClass}
							key={i}>

								<div className="lemma-meta">
									{(line.n % 5 === 0) ?
										<span className="lemma-line-n" >
												{line.n}
										</span>
									: ""
									}
								</div>

								<div className="lemma-text" dangerouslySetInnerHTML={{__html: line.html}} >
								</div>


						</div>

					})}

						<div className="lemma-load" >
								<div className="lemma-spinner"></div>

						</div>

				</div>

				<div className="edition-tabs tabs">
					{this.data.lemmaText.map(function(lemmaTextEdition, i){
						let lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

						return

														<RaisedButton
																key={i}
																label={lemmaEditionTitle}
																data-edition={lemmaTextEdition.title}
																className={self.data.selectedLemmaEdition.slug ===	lemmaTextEdition.slug ? "edition-tab tab selected-edition-tab" : "edition-tab tab"}
																onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
														/>

					})}

				</div>

				<div className="meta-tabs tabs">
						<FlatButton
								label="Highlighting"
								className="edition-tab tab"
								onClick={this.toggleHighlighting}
								>
						</FlatButton>
						<FlatButton
								label="Scansion"
								className="edition-tab tab"
								onClick={this.toggleScansion}
								>
						</FlatButton>
				</div>
		</div>


	 );
	}

});
