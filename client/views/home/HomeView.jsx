
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

          <div data-ng-controller="IndexController as index" className="content primary">

            <section className="header cover fullscreen parallax">
                <div className="background-image-holder remove-blur blur-10">
                   <img className="background-image" src="/images/hector.jpg"/>
                </div>
                <div className="block-screen brown"></div>

                <div className="container v-align-transform wow fadeIn" data-wow-duration="1s" data-wow-delay="0.1s">

                    <div className="grid inner">
                        <div className="center-content" >

                            <div className="site-title-wrap">
                                <h1 className="site-title">A Homer Commentary<br/>in Progress</h1>
                                <h3 className="site-subtitle">
                                    An evolving, collaborative commentary based on the cumulative research of Milman Parry and Albert Lord, who created a new way of thinking about Homeric poetry
                                </h3>
                            </div>

                            <RaisedButton href="#intro"  className="cover-link learn-more">
                                Learn More
                            </RaisedButton>

                            <RaisedButton href="/commentary/"  className="cover-link accent paper-shadow">
                                Go to Commentary
                            </RaisedButton>

                        </div>
                    </div>
                </div>
            </section>

            <section className="intro">
                <div className="container">
                    <div className="row">
                        <h2 >Quid faciat laetas segetes quo</h2>

                        <div className="intro-col intro-col-text">

                            <div className="mb40 mb-xs-24l intro-block-text ">
                                <h5 className="uppercase intro-block-header">Sidere terram vertere</h5>
                                <span className="intro-block-desc">
                                    Mycenas, ulmisque adiungere vites conveniat quae curum boum qui cultus
                                    habendo sit pecori apibus quanta experientia parcis.
                                </span>
                            </div>

                            <div className="mb40 mb-xs-24 intro-block-text ">
                                <h5 className="uppercase intro-block-header">Hinc canere incipiam</h5>
                                <span className="intro-block-desc">
                                    Vos, o agrestum praesentia numina fauni ferte simul faunique pedem dryadesque
                                    puellae munera vestro cano.
                                </span>
                            </div>

                            <RaisedButton className="cover-link dark " href="/"  className=" paper-shadow">
                                Troiae qui primus
                            </RaisedButton>

                        </div>
                        <div className="intro-col intro-col-image image-wrap wow fadeIn">
                            <img className="paper-shadow" alt="Ajax and Achilles" src="/images/ajax_achilles_3.jpg" />
                            <div className="caption">
                                <span className="caption-text">"Quid faciat laetas segetes quo sidere", Terram Vertere. 1865. Oil on canvas. Center for Hellenic Studies, Washington, DC.</span>
                            </div>
                        </div>
                    </div>
                    {/*<!--end of row-->*/}
                </div>
                {/*<!--end of container-->*/}
            </section>


            <section className="goals parallax">

                <div className="background-image-holder blur-4--no-remove">
                   <img alt="image" className="background-image" src="/images/mss_2.jpg"/>
                </div>
                <div className="block-screen brown"></div>

                <div className="container ">

                  <div className="goal hvr-grow wow fadeInUp" >
                      <img className="goal-image" src="/images/svg-icons/pen.svg"/>
                      <div className="goal-text">
                        <h3 className="goal-title">Collaborative commenting and editing</h3>
                        <span className="goal-desc">Writing as a collaborative process between principal authors and associate editors</span>
                      </div>
                  </div>

                  <div className="goal hvr-grow wow fadeInUp" data-wow-delay="0.5s">
                      <img className="goal-image" src="/images/svg-icons/book-opened.svg"/>
                      <div className="goal-text">
                        <h3 className="goal-title">System and beauty</h3>
                        <span className="goal-desc">Linguistic approach analyzing both synchronically and diachronically the formulaic system of Homeric poetry</span>
                      </div>
                  </div>

                  <div className="goal hvr-grow wow fadeInUp" data-wow-delay="1s">
                      <img className="goal-image" src="/images/svg-icons/bank.svg"/>
                      <div className="goal-text">
                        <h3 className="goal-title">A growing effort of scholars still in progress</h3>
                        <span className="goal-desc">The commentary constitutes work from a diverse team representing three generations of researchers</span>
                      </div>
                  </div>

              </div>


            </section>

            <section className="browse-commentary block-shadow" >

              <WorksList />

            </section>


            <section className="keywords">
                <div className="grid inner">
                    <h2 className="keyword-divider-title">Keywords</h2>
                    <div className="underline"></div>

                    <KeywordsList />

                    <RaisedButton href="/keyword/index"  className="cover-link show-more primary paper-shadow">
                        More Keywords
                    </RaisedButton>

                </div>
            </section>

            <section className="parallax commentators">
                <div className="background-image-holder blur-4--no-remove">
                   <img className="background-image" src="/images/school-athens.jpg"/>
                </div>
                <div className="block-screen"></div>

                <div className="container">

                  <h2 className="block-title">Commenters</h2>


                    <CommentersList />

                    <RaisedButton href="/commentator/index"  className="cover-link light show-more paper-shadow">
                        Other Commenters
                    </RaisedButton>

                </div>

            </section>

            <section className="get-started" layout="column" flex>

                  <h2 className="block-title">Get Started</h2>

                  <div className="get-started-comments">

                    <Commentary />

                  </div>

            </section>

            <ContextPanel />

          </div>

        </div>

    );
  }
});
