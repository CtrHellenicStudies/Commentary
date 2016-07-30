import '../../node_modules/mdi/css/materialdesignicons.css';



MasterLayout = React.createClass({

	render(){
		return(
			<div className="chs-layout master-layout">

				<Header />

				<main>
					{this.props.content}
				</main>
				<Footer/>

				<FilterWidget filters={[]}/>
			  {/*<ModalLogin />
				<ModalSignup />*/}

			</div>
			);
		}

});
