CommentaryLayout = React.createClass({

	propTypes: {
		queryParams: React.PropTypes.object,
	},

  getInitialState(){
		const filters = [];

		if("_id" in this.props.queryParams){
			filters.push({
				key: "_id",
				values: [this.props.queryParams._id]
			});
		}

    return {
      filters: filters,
			skip: 0,
			limit: 10
    };
  },

	loadMoreComments(){
	    this.setState({
	      skip : this.state.skip + this.state.limit
	    });

			//console.log("Load more comments:", this.state.skip);
	},

	toggleSearchTerm(key, value){
		var self = this,
				filters = this.state.filters;
		var keyIsInFilter = false,
				valueIsInFilter = false,
				filterValueToRemove,
				filterToRemove;

		filters.forEach(function(filter, i){
			if(filter.key === key){
				keyIsInFilter = true;

				filter.values.forEach(function(filterValue, j){
						if(filterValue._id === value._id){
							valueIsInFilter = true;
							filterValueToRemove = j;
						}
				})

				if(valueIsInFilter){
					filter.values.splice(filterValueToRemove, 1);
					if(filter.values.length === 0){
						filterToRemove = i;
					}
				}else {
					if(key === "works"){
						filter.values = [value];
					}else {
						filter.values.push(value);
					}
				}

			}

		});


		if(typeof filterToRemove !== "undefined"){
			filters.splice(filterToRemove, 1);
		}

		if(!keyIsInFilter){
			filters.push({
									key: key,
									values: [value]
								});

		}

		this.setState({
			filters: filters,
			skip: 0
		});

	},

	handleChangeTextsearch(textsearch){

		var filters = this.state.filters;

		if(textsearch && textsearch.length){
			var textsearchInFilters = false;

			filters.forEach(function(filter, i){
				if(filter.key === "textsearch"){
					filter.values = [textsearch];
					textsearchInFilters = true;
				}
			});

			if(!textsearchInFilters){
				filters.push({
					key:"textsearch",
					values:[textsearch]
				})
			}

		}else {
			var filterToRemove;

			filters.forEach(function(filter, i){
				if(filter.key === "textsearch"){
					filterToRemove = i;
				}

			});

			if(typeof filterToRemove !== "undefined"){
				filters.splice(filterToRemove, 1);
			}


		}

		this.setState({
			filters: filters
		})

	},

	handleChangeLineN(e){

		var filters = this.state.filters;

		if(e.from > 1){
			var lineFromInFilters = false;

			filters.forEach(function(filter, i){
				if(filter.key === "lineFrom"){
					filter.values = [e.from];
					lineFromInFilters = true;
				}
			});

			if(!lineFromInFilters){
				filters.push({
					key:"lineFrom",
					values:[e.from]
				})
			}

		}else {
			var filterToRemove;

			filters.forEach(function(filter, i){
				if(filter.key === "lineFrom"){
					filterToRemove = i;
				}

			});

			if(typeof filterToRemove !== "undefined"){
				filters.splice(filterToRemove, 1);
			}

		}

		if(e.to < 2100){
			var lineToInFilters = false;

			filters.forEach(function(filter, i){
				if(filter.key === "lineTo"){
					filter.values = [e.to];
					lineToInFilters = true;
				}
			});

			if(!lineToInFilters){
				filters.push({
					key:"lineTo",
					values:[e.to]
				})
			}

		}else {
			var filterToRemove;

			filters.forEach(function(filter, i){
				if(filter.key === "lineTo"){
					filterToRemove = i;
				}

			});

			if(typeof filterToRemove !== "undefined"){
				filters.splice(filterToRemove, 1);
			}

		}


		this.setState({
			filters: filters
		})

	},

	render(){
		console.log("CommentaryLayout.filters", this.state.filters);
		return(
			<div className="chs-layout commentary-layout">

				<Header
					filters={this.state.filters}
					toggleSearchTerm={this.toggleSearchTerm}
					handleChangeLineN={this.handleChangeLineN}
					handleChangeTextsearch={this.handleChangeTextsearch}
					initialSearchEnabled
					/>

				<Commentary
					filters={this.state.filters}
					toggleSearchTerm={this.toggleSearchTerm}
					loadMoreComments={this.loadMoreComments}
					skip={this.state.skip}
					limit={this.state.limit}
					/>

			</div>
			);
		}

});
