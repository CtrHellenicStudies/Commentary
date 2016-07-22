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
                    className="leftnav"
                >
                    <div className="leftnav-upper">

                    </div>
                    {is_logged_in ?
                        <div>
                            <MenuItem
                                href="/admin"
                                target="_blank"
                                primaryText="Admin"
                                onTouchTap={this.props.closeLeftMenu}
                                onClick={this.props.closeLeftMenu}
                            />
                            <Divider />
                        </div>
                        : ""
                    }
                    {/*<MenuItem
                     href="/sign-up"
                     primaryText="Create an Account"
                     onTouchTap={this.props.closeLeftMenu}
                     onClick={this.props.closeLeftMenu}
                     />
                     <MenuItem
                     href="/sign-in"
                     primaryText="Sign In"
                     onTouchTap={this.props.closeLeftMenu}
                     onClick={this.props.closeLeftMenu}
                     />
                     <Divider />*/}

                    <MenuItem
                        href="#plan-your-trip"
                        primaryText="PLAN YOUR TRIP"
                        onTouchTap={this.props.closeLeftMenu}
                        onClick={this.props.closeLeftMenu}
                    />
                    <MenuItem
                        href="#events"
                        primaryText="EVENTS"
                        onTouchTap={this.props.closeLeftMenu}
                        onClick={this.props.closeLeftMenu}
                    />
                    <MenuItem
                          href="#symposium"
                          primaryText="SYMPOSIUM"
                          onTouchTap={this.props.closeLeftMenu}
                          onClick={this.props.closeLeftMenu}
                      />
                    <MenuItem
                          href="#catalog"
                          primaryText="CATALOG"
                          onTouchTap={this.props.closeLeftMenu}
                          onClick={this.props.closeLeftMenu}
                      />
                    <MenuItem
                          href="#lenders"
                          primaryText="LENDERS"
                          onTouchTap={this.props.closeLeftMenu}
                          onClick={this.props.closeLeftMenu}
                      />

                    <Divider />

                    <MenuItem
                        href="//hcl.harvard.edu/libraries/houghton/"
                        primaryText="Houghton"
                        target="_blank"
                        onTouchTap={this.props.closeLeftMenu}
                        onClick={this.props.closeLeftMenu}
                    />
                    <MenuItem
                        href="//www.bc.edu/sites/artmuseum/"
                        primaryText="McMullen"
                        target="_blank"
                        onTouchTap={this.props.closeLeftMenu}
                        onClick={this.props.closeLeftMenu}
                    />
                    <MenuItem
                        href="//www.gardnermuseum.org/collection/exhibitions"
                        primaryText="Gardner"
                        target="_blank"
                        onTouchTap={this.props.closeLeftMenu}
                        onClick={this.props.closeLeftMenu}
                    />
                </Drawer>
            </div>
        );
    }
});
