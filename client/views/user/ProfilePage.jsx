import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';


ProfilePage = React.createClass({

  propTypes: {
    work: React.PropTypes.object.isRequired,
    textNodes: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      annotationCheckList: [],
    }
  },

  render() {
    let work = this.props.work;
    let user_is_loggedin = false;

    return (
        <div className="page page-user-profile">
          <div class="content primary">

              <section class="block header cover parallax">
                  <div class="background-image-holder blur-2--no-remove blur-10 remove-blur">
                      <img alt="image" class="background-image" src="/images/capitals.jpg"/>
                  </div>
                  <div class="block-screen brown"></div>

                  <div class="container v-align-transform">

                      <div class="grid inner">
                          <div class="center-content">

                              <div class="page-title-wrap">
                                  <h2 class="page-title ">{user.nicename}</h2>
                                  <h3 class="page-subtitle"></h3>
                              </div>


                          </div>
                      </div>
                  </div>
              </section>

              <section class="page-content">
                {user_is_loggedin ?
                      <p>
                          {user.bio}
                      </p>
                  :
                    <div className="user-profile-section">
                        <div className="user-profile-picture">
                          <img src="/images/entity_cato-small.jpg" />
                        </div>

                        <div className="upload-profile-picture">
                          <FlatButton
                            label="Change Profile Picture"
                            className="user-profile-button save-button"
                            onClick={this._openFileDialog}/>
                          <input
                            ref="fileUpload"
                            type="file"
                            style={"display" : "none"}
                            onChange={this._handleChange}/>

                        </div>
                      </div>
                      <br/>

                      <div className="user-profile-textfields">
                        <TextField
                            fullWidth={true}
                            defaultValue="Archimedes"
                            floatingLabelText="First Name"
                          />
                        <br/>

                        <TextField
                            fullWidth={true}
                            defaultValue="of Syracuse"
                            floatingLabelText="Last Name"
                          />
                        <br/>

                        <TextField
                            multiLine={true}
                            rows={2}
                            rowsMax={10}
                            fullWidth={true}
                            defaultValue="Inventor of the Claw and the Death Ray. Helped build the walls of Syracuse. All around badass."
                            floatingLabelText="Biography"
                          />
                        <br />

                        <TextField
                            fullWidth={true}
                            hintText="http://university.academia.edu/YourName"
                            floatingLabelText="Academia.edu"
                          />
                        <br/>

                        <TextField
                            fullWidth={true}
                            hintText="https://plus.google.com/+YourName"
                            floatingLabelText="Google Plus"
                          />
                        <br/>

                        <TextField
                            fullWidth={true}
                            hintText="https://twitter.com/@your_name"
                            floatingLabelText="Twitter"
                          />
                        <br/>

                        <TextField
                            fullWidth={true}
                            hintText="https://facebook.com/your.name"
                            floatingLabelText="Facebook"
                          />
                        <br/>
                        <br/>
                        <br/>

                      </div>

                      <FlatButton
                        label="Save"
                        className="user-profile-button save-button"
                        />


                  }

                  <div class="article-content">
                      <div id="container1" class="data-visualization"></div>
                      <div id="container2" class="data-visualization"></div>
                  </div>

                  <hr class="user-divider"/>

                  <div class="user-discussion-comments">
                      <DiscussionCommentsList />

                  </div>

              </section>


          </div>

        </div>

    );

  }

});
