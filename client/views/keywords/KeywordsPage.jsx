KeywordsPage = React.createClass({

  propTypes: {
  },

  render() {

     return (
       <div className="page keywords-page">

          <div data-ng-controller="PageController as page" className="content primary">

              <section className="block header header-page  cover parallax">
                  <div className="background-image-holder blur-2--no-remove remove-blur  blur-10">
                      <img className="background-image" src="/images/apotheosis_homer.jpg"/>
                  </div>
                  <div className="block-screen brown"></div>

                  <div className="container v-align-transform">

                      <div className="grid inner">
                          <div className="center-content">

                              <div className="page-title-wrap">
                                  <h2 className="page-title ">${keyword.title}</h2>
                              </div>


                          </div>
                      </div>
                  </div>
              </section>
              <section className="page-content">


                  <p>
                      Quae res in civitate duae plurimum possunt, eae contra nos ambae faciunt in hoc tempore, summa gratia et eloquentia; quarum alterum, C. Aquili, vereor, alteram metuo. Eloquentia Q. Hortensi ne me in dicendo impediat, non nihil commoveor, gratia Sex. Naevi ne P. Quinctio noceat, id vero non mediocriter pertimesco. Neque hoc tanto opere querendum videretur, haec summa in illis esse, si in nobis essent saltem mediocria; verum ita se res habet, ut ego, qui neque usu satis et ingenio parum possum, cum patrono disertissimo comparer
                  </p>
                  <p>
                      P. Quinctius, cui tenues opes, nullae facultates, exiguae amicorum copiae sunt, cum adversario gratiosissimo contendat. Illud quoque nobis accedit incommodum, quod M. Iunius, qui hanc causam aliquotiens apud te egit, homo et in aliis causis exercitatus et in hac multum ac saepe versatus, hoc tempore abest nova legatione impeditus, et ad me ventum est qui, ut summa haberem cetera, temporis quidem certe vix satis habui ut rem tantam, tot controversiis implicatam, possem cognoscere. Ita quod mihi consuevit in ceteris causis esse adiumento, id quoque in hac causa deficit. Nam, quod ingenio minus possum, subsidium mihi diligentia comparavi; quae quanta sit, nisi tempus et spatium datum sit, intellegi non potest. Quae quo plura sunt
                  </p>
                  <p>
                      C. Aquili, eo te et hos qui tibi in consilio sunt meliore mente nostra verba audire oportebit, ut multis incommodis veritas debilitata tandem aequitate talium virorum recreetur. Quod si tu iudex nullo praesidio fuisse videbere contra vim et gratiam solitudini atque inopiae, si apud hoc consilium ex opibus, non ex veritate causa pendetur, profecto nihil est iam sanctum atque sincerum in civitate, nihil est quod humilitatem cuiusquam gravitas et virtus iudicis consoletur. Certe aut apud te et hos qui tibi adsunt veritas valebit, aut ex hoc loco repulsa vi et gratia locum ubi consistat reperire non poterit.

                  </p>

              </section>



          </div>



       </div>


      );
    }


});
