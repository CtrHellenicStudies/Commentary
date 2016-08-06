CommentaryLayout = React.createClass({

  getInitialState(){
    return {
      filters: [],
    };
  },

	toggleSearchTerm(key, value){
		var self = this,
				filters = this.state.filters || [];
		var keyIsInFilter = false,
				valueIsInFilter = false,
				filterToRemove;


		this.state.filters.forEach(function(filter){
			if(filter.key === key){
				keyIsInFilter = true;

				filter.values.forEach(function(filterValue, i){
						if(filterValue._id === value._id){
							valueIsInFilter = true;
							filterToRemove = i;
						}
				})

				if(valueIsInFilter){
					filter.values = filter.values.splice(filterToRemove, 1);
				}else {
					filter.values.push(value);
				}

			}

		});

		if(!keyIsInFilter){
			filters.push({
									key: key,
									values: [value]
								});

		}

		this.setState({
			filters: filters
		});

	},

	handleChangeLineN(e){
		var $target = $(e.target);

		debugger;

	},

	render(){
		console.log("CommentaryLayout.filters", this.state.filters);
		return(
			<div className="chs-layout commentary-layout">

				<Header toggleSearchTerm={this.toggleSearchTerm} handleChangeLineN={this.handleChangeLineN}/>

				<Commentary filters={this.state.filters} toggleSearchTerm={this.toggleSearchTerm} />


				<FilterWidget filters={this.state.filters}/>
			  {/*<ModalLogin />
				<ModalSignup />*/}

			</div>
			);
		}

});
