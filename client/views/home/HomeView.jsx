
import RaisedButton from 'material-ui/RaisedButton';

HomeView = React.createClass({

  componentDidMount() {

    /*
     * Init wow animations on homepage
     */
    var w;
    w = new WOW().init();

  },

  render(){
      return (
        <div className="home">

          <div data-ng-controller="IndexController as index" class="content primary">

            <section class="header cover fullscreen parallax">
                <div class="background-image-holder remove-blur blur-10">
                   <asset:image alt="image" class="background-image" src="hector.jpg"/>
                </div>
                <div class="block-screen brown"></div>

                <div class="container v-align-transform wow fadeIn" data-wow-duration="1s" data-wow-delay="0.1s">

                    <div class="grid inner">
                        <div class="center-content" >

                            <div class="site-title-wrap">
                                <h1 class="site-title">A Homer Commentary<br>in Progress</h1>
                                <h3 class="site-subtitle">
                                    An evolving, collaborative commentary based on the cumulative research of Milman Parry and Albert Lord, who created a new way of thinking about Homeric poetry
                                </h3>
                            </div>

                            <RaisedButton href="#intro"  class="cover-link learn-more">
                                Learn More
                            </RaisedButton>

                            <RaisedButton href="/commentary/"  class="cover-link accent paper-shadow">
                                Go to Commentary
                            </RaisedButton>

                        </div>
                    </div>
                </div>
            </section>

            <section class="intro">
                <div class="container">
                    <div class="row">
                        <h2 >Quid faciat laetas segetes quo</h2>

                        <div class="intro-col intro-col-text">

                            <div class="mb40 mb-xs-24l intro-block-text ">
                                <h5 class="uppercase intro-block-header">Sidere terram vertere</h5>
                                <span class="intro-block-desc">
                                    Mycenas, ulmisque adiungere vites conveniat quae curum boum qui cultus
                                    habendo sit pecori apibus quanta experientia parcis.
                                </span>
                            </div>

                            <div class="mb40 mb-xs-24 intro-block-text ">
                                <h5 class="uppercase intro-block-header">Hinc canere incipiam</h5>
                                <span class="intro-block-desc">
                                    Vos, o agrestum praesentia numina fauni ferte simul faunique pedem dryadesque
                                    puellae munera vestro cano.
                                </span>
                            </div>

                            <RaisedButton class="cover-link dark " href="/"  class=" paper-shadow">
                                Troiae qui primus
                            </RaisedButton>

                        </div>
                        <div class="intro-col intro-col-image image-wrap wow fadeIn">
                            <asset:image class="paper-shadow" alt="Ajax and Achilles" src="ajax_achilles_3.jpg" />
                            <div class="caption">
                                <span class="caption-text">"Quid faciat laetas segetes quo sidere", Terram Vertere. 1865. Oil on canvas. Center for Hellenic Studies, Washington, DC.</span>
                            </div>
                        </div>
                    </div>
                    <!--end of row-->
                </div>
                <!--end of container-->
            </section>


            <section class="goals parallax">

                <div class="background-image-holder blur-4--no-remove">
                   <asset:image alt="image" class="background-image" src="mss_2.jpg"/>
                </div>
                <div class="block-screen brown"></div>

                <div class="container ">

                  <div class="goal hvr-grow wow fadeInUp" >
                      <asset:image class="goal-image" src="svg-icons/pen.svg"></asset:image>
                      <div class="goal-text">
                        <h3 class="goal-title">Collaborative commenting and editing</h3>
                        <span class="goal-desc">Writing as a collaborative process between principal authors and associate editors</span>
                      </div>
                  </div>

                  <div class="goal hvr-grow wow fadeInUp" data-wow-delay="0.5s">
                      <asset:image class="goal-image" src="svg-icons/book-opened.svg"></asset:image>
                      <div class="goal-text">
                        <h3 class="goal-title">System and beauty</h3>
                        <span class="goal-desc">Linguistic approach analyzing both synchronically and diachronically the formulaic system of Homeric poetry</span>
                      </div>
                  </div>

                  <div class="goal hvr-grow wow fadeInUp" data-wow-delay="1s">
                      <asset:image class="goal-image" src="svg-icons/bank.svg"></asset:image>
                      <div class="goal-text">
                        <h3 class="goal-title">A growing effort of scholars still in progress</h3>
                        <span class="goal-desc">The commentary constitutes work from a diverse team representing three generations of researchers</span>
                      </div>
                  </div>

              </div>


            </section>

            <section class="browse-commentary block-shadow" >

              <WorksList />

            </section>


            <section class="keywords">
                <div class="grid inner">
                    <h2 class="keyword-divider-title">Keywords</h2>
                    <div class="underline"></div>

                    <KeywordsList />

                    <RaisedButton href="/keyword/index"  class="cover-link show-more primary paper-shadow">
                        More Keywords
                    </RaisedButton>

                </div>
            </section>

            <section class="parallax commentators">
                <div class="background-image-holder blur-4--no-remove">
                   <asset:image alt="image" class="background-image" src="school-athens.jpg"/>
                </div>
                <div class="block-screen"></div>

                <div class="container">

                  <h2 class="block-title">Commenters</h2>


                    <CommentersList />

                    <RaisedButton href="/commentator/index"  class="cover-link light show-more paper-shadow">
                        Other Commenters
                    </RaisedButton>

                </div>

            </section>

            <section class="get-started" layout="column" flex>

                  <h2 class="block-title">Get Started</h2>

                  <div class="get-started-comments">

                    <

                  </div>

            </section>

            <ContextPanel />

          </div>

        </div>

    );
  }
});
