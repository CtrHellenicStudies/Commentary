CommentersPage = React.createClass({

  propTypes: {
  },

  render() {

     return (
       <div className="page commenters-page">

          <div data-ng-controller="PageController as page" className="content primary">

              <section className="block header cover parallax">
                  <div className="background-image-holder blur-2--no-remove blur-10 remove-blur">
                      <img className="background-image" src="/images/capitals.jpg"/>
                  </div>
                  <div className="block-screen brown"></div>

                  <div className="container v-align-transform">

                      <div className="grid inner">
                          <div className="center-content">

                              <div className="page-title-wrap">
                                  <h2 className="page-title ">
                                      ${commentator.name}
                                  </h2>
                                  <h3 className="page-subtitle"></h3>
                              </div>


                          </div>
                      </div>
                  </div>
              </section>
              <section className="page-content">

                  <div className="author-image paper-shadow">
                      <img src="/images/default_user.jpg" alt="{commentator.name}"/>
                  </div>

                  <div className="user-bio">
                    {user.bio ?
                        <div>{user.bio}</div>
                      :
                        <p>There is no biography information for this user yet.</p>
                    }

                  </div>

                  <div className="article-content">
                      <div id="container1" className="data-visualization"></div>
                      <div id="container2" className="data-visualization"></div>
                  </div>

              </section>

              <CommentsRecent />
          </div>

       </div>


      );
    }


});
