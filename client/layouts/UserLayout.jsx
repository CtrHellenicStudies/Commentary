UserLayout = React.createClass({
	render(){
		return(
			<div className="chs-layout user-layout">
				<Header />
				<div className="container" >
					<div className="row">
						<div className="col-md-8">
							<BlazeToReact blazeTemplate="profile" />
						</div>
						<div className="col-md-4">
							<div>
								{/*<BookmarkList />*/}
							</div>
						</div>
					</div>
				</div>
				<Footer/>
			</div>
			);
		}

});
