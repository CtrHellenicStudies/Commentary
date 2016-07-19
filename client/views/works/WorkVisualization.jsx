import injectTapEventPlugin from 'react-tap-event-plugin';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CommunicationComment from 'material-ui/svg-icons/communication/comment';
import ActionInput from 'material-ui/svg-icons/action/input';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
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

            <a href="/commentary" target="_self" >
                <h3 class="text-title">${work.title}</h3>
            </a>

            <hr class="text-divider">

            <div class="text-meta">
                <!-- These links should be dynamic in the future -->
                <!--a target="_self">
                    <span class="text-commentors">3 Commentors</span>
                </a>
                <a target="_self">
                    <span class="text-comment-count">2,650 Comments</span>
                </a>
                <a target="_self">
                    <span class="text-discussion-count">298 Discussions</span>
                </a-->
            </div>


            <div class="text-subworks " >

                <g:each in="${work.subworks}" var="subwork" >
                    <div class="text-subwork">
                        <md-button aria-label="${subwork}" href="/commentary" target="_self"
                                   class="subwork-inner subwork-weight-${subwork.w} wow zoomIn" data-wow-duration="0.2s">
                            <span class="subwork-num">${subwork.n}</span>
                            <span class="subwork-alpha">${subwork.a}</span>
                            <div class="grow-border"></div>
                        </md-button>
                    </div>
                </g:each>

            </div>



        </div>


        </div>
      );
    }

});
