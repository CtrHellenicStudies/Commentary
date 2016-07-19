MasterLayout = React.createClass({

	render(){
		return(
			<div className="chs-layout master-layout">

			  <Sidebar />



				<Header />
				<main>
					{this.props.content}
				</main>
				<Footer/>

			  <g:render template="/shared/filter_widget" />
			  <ModalLogin />
			  <g:render template="/shared/modal_signup" />

			</div>
			);
		}

});
