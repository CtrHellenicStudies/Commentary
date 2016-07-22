import RaisedButton from 'material-ui/RaisedButton';


// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

WorkVisualization = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired
  },

  propTypes: {
    work: React.PropTypes.object.isRequired
  },


  render() {
    let work = this.props.work;
    let work_url = "/commentary/?q=work." + work.slug ;

     return (
       <div className="work-teaser">
         <div class="commentary-text ${work.slug}">

            <a href="/commentary"  >
                <h3 class="text-title">${work.title}</h3>
            </a>

            <hr class="text-divider">

            <div class="text-meta">
            </div>


            <div class="text-subworks " >

                <div class="text-subwork">
                </div>

            </div>



        </div>


        </div>
      );
    }

});
