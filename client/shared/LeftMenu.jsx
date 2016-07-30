import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

LeftMenu = React.createClass({


    propTypes: {
        open: React.PropTypes.bool.isRequired,
        closeLeftMenu: React.PropTypes.func.isRequired,
    },

    getChildContext() {
        return {muiTheme: getMuiTheme(baseTheme)};
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired,
    },

    scrollToAbout(e){
        $("html, body").animate({scrollTop: $('#about').height() - 100}, 300);

        this.props.closeLeftMenu();
        e.preventDefault();
    },

    render(){
        var is_logged_in = Meteor.userId() ? Meteor.userId() : false;
        return (
            <div>
                <Drawer
                    open={this.props.open}
                    docked={false}
                    onRequestChange={open => this.setState({open})}
                    className="md-sidenav-left"
                >
                    <div className="sidenav-top">
                      {is_logged_in ?
                          <div>
                            <div className="user-image paper-shadow">
                              <img src="/images/default_user.jpg"/>
                            </div>
                          </div>
                          : ""
                      }
                      <span className="user-fullname">
                        Archimedes of Syracuse
                      </span>


                    </div>
                    <MenuItem
                        href="/"
                        primaryText="Home"
                        onClick={this.props.closeLeftMenu}
                    />
                    <MenuItem
                        href="/commentary/"
                        primaryText="Commentary"
                        onClick={this.props.closeLeftMenu}
                    />
                    <MenuItem
                          href="/keywords/"
                          primaryText="Keywords"
                          onClick={this.props.closeLeftMenu}
                      />
                    <MenuItem
                          href="/commenters/"
                          primaryText="Commenters"
                          onClick={this.props.closeLeftMenu}
                      />
                    <MenuItem
                          href="/about"
                          primaryText="About"
                          onClick={this.props.closeLeftMenu}
                      />

                    <Divider />

                    {is_logged_in ?
                      <div>
                        <MenuItem
                            href="/profile/"
                            primaryText="Your Comments"
                            target="_blank"
                            onClick={this.props.closeLeftMenu}
                        />
                        <MenuItem
                            href="/account/"
                            primaryText="Account"
                            target="_blank"
                            onClick={this.props.closeLeftMenu}
                        />
                        <MenuItem
                            href="/sign-out"
                            primaryText="Sign out"
                            target="_blank"
                            onClick={this.props.closeLeftMenu}
                        />
                    </div>
                    :
                    <MenuItem
                          href="/sign-in"
                          primaryText="Sign in"
                          target="_blank"
                          onClick={this.props.closeLeftMenu}
                      />
                    }
                </Drawer>
            </div>
        );
    }
});
