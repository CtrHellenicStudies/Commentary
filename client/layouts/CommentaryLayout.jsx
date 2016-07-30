CommentaryLayout = React.createClass({

	render(){
		return(
			<div className="chs-layout commentary-layout">

				<Header />

				<Commentary />

				<Footer/>

				<FilterWidget filters={[]}/>
			  {/*<ModalLogin />
				<ModalSignup />*/}

			</div>
			);
		}

});
