import RaisedButton from 'material-ui/RaisedButton';

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
         <div className="commentary-text ${work.slug}">

            <a href="/commentary"  >
                <h3 className="text-title">${work.title}</h3>
            </a>

            <hr className="text-divider" />

            <div className="text-meta">
            </div>


            <div className="text-subworks " >

                <div className="text-subwork">
                </div>

            </div>


          </div>

        </div>
      );
    }

});
