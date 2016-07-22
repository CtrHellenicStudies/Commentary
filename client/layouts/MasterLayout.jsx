MasterLayout = React.createClass({

	render(){
		return(
			<div className="chs-layout master-layout">

			  <LeftMenu />

				<Header />

				<main>
					{this.props.content}
				</main>
				<Footer/>

				<FilterWidget />
			  <ModalLogin />
				<ModalSignup />

			</div>
			);
		}

});
