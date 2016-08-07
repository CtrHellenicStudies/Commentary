import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

SearchTermButton = React.createClass({

  propTypes: {
		toggleSearchTerm: React.PropTypes.func.isRequired,
		label: React.PropTypes.string.isRequired,
		searchTermKey: React.PropTypes.string.isRequired,
		value: React.PropTypes.object.isRequired,
		activeWork: React.PropTypes.bool
  },

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

  getInitialState(){
    return {
      active : false,
		};

	},

	toggleSearchTerm(){
		this.props.toggleSearchTerm(this.props.searchTermKey, this.props.value);
		this.setState({
			active: !this.state.active
		});

	},

  render(){
		var className = "search-term-button";
		var active = false;

		if("activeWork" in this.props){
			if(this.props.activeWork === true){
				active = true
			}

		}else{
			if(this.state.active){
				active = true;
			}

		}

		if(active){
			className += " search-term-button--active";
		}

		return <li>
              <FlatButton
								className={className}
                onClick={this.toggleSearchTerm}
								label={this.props.label}
                icon={<FontIcon className="mdi mdi-plus-circle-outline" />}
                >
              </FlatButton>

            </li>


	}

});
