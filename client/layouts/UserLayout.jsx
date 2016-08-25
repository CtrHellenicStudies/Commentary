import '../../node_modules/mdi/css/materialdesignicons.css';


UserLayout = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
		var user = Meteor.user();

		if(user && !("profile" in user)){
			user.profile = {};
		}
		return {
			user: user
		}

	},


	render(){
		return(
			<div className="chs-layout master-layout">

				<Header />

				<main>
					{this.data.user ?
						<ProfilePage user={this.data.user}/>
					: ""}
				</main>
				<Footer/>

			</div>
			);
		}

});
