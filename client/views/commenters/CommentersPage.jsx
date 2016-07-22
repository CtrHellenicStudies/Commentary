CommentersPage = React.createClass({

  propTypes: {
  },

  render() {

     return (
       <div className="page commenters-page">

          <div data-ng-controller="PageController as page" class="content primary">

              <section class="block header cover parallax">
                  <div class="background-image-holder blur-2--no-remove blur-10 remove-blur">
                      <asset:image alt="image" class="background-image" src="capitals.jpg"/>
                  </div>
                  <div class="block-screen brown"></div>

                  <div class="container v-align-transform">

                      <div class="grid inner">
                          <div class="center-content">

                              <div class="page-title-wrap">
                                  <h2 class="page-title ">
                                      ${commentator.name}
                                  </h2>
                                  <h3 class="page-subtitle"></h3>
                              </div>


                          </div>
                      </div>
                  </div>
              </section>
              <section class="page-content">

                  <div class="author-image paper-shadow">
                      <img src="/images/default_user.jpg" alt="{commentator.name}"/>
                  </div>

                  <div className="user-bio">
                    {user.bio ?
                        {user.bio}
                      :
                        <p>There is no biography information for this user yet.</p>
                    }

                  </div>

                  <div class="article-content">
                      <div id="container1" class="data-visualization"></div>
                      <div id="container2" class="data-visualization"></div>
                  </div>

              </section>

              <CommentsRecent />
          </div>

       </div>


      );
    }


});
