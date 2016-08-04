CommentaryLayout = React.createClass({

  getInitialState(){
    return {
      filters : []
		}
	},

	toggleSearchTerm(e){
		var $target = $(e.target);

		debugger;

	},

	handleChangeLineN(e){
		var $target = $(e.target);

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
