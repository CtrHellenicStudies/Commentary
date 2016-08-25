
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

ModalLogin = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },

	propTypes: {
		lowered: React.PropTypes.bool,
		closeModal: React.PropTypes.func
	},

  render(){

    let styles = {
      flatButton : {
        width: "auto",
        minWidth: "none",
        height: "55px",
        padding: "10px 5px"
      },
      flatIconButton : {
        padding: "10px 20px",
        width: "auto",
        minWidth: "none",
        height: "55px",

      }

    };

		let lowered = this.props.lowered;

    return (
      <div className={"ahcip-modal-login ahcip-modal ahcip-login-signup" + ((lowered) ? " lowered" : "")}>
        <div className="close-modal paper-shadow"
					onClick={this.props.closeModal}
					>
          <i className="mdi mdi-close"></i>
        </div>
        <div className="modal-inner">
					<BlazeToReact blazeTemplate="atForm" state="signIn" />
        </div>
      </div>
      );
  }
});
