CommentaryLayout = React.createClass({

	toggleSearchTerm(){
		debugger;

	},

	handleChangeLineN(){
		debugger;

	},

	render(){
		return(
			<div className="chs-layout commentary-layout">

				<Header toggleSearchTerm={this.toggleSearchTerm} handleChangeLineN={this.handleChangeLineN}/>

				<Commentary toggleSearchTerm={this.toggleSearchTerm} />


				<FilterWidget filters={[]}/>
			  {/*<ModalLogin />
				<ModalSignup />*/}

			</div>
			);
		}

});
