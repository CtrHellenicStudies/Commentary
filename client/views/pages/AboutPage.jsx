AboutPage = React.createClass({

	mixins: [ReactMeteorData],

	getMeteorData() {
		const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

		return {
			settings: settingsHandle.ready() ? Settings.findOne() : { title: '' }
		};
	},

	render() {
		const { settings } = this.data;
		Utils.setTitle(`About | ${settings.title}`);
		Utils.setDescription('The intellectual goal of the original editors is simple and at the same time most ambitious: of all existing commentaries on Homeric poetry, this project is the first and only such commentary that is based squarely on the cumulative research of Milman Parry and his student, Albert Lord, who created a new way of thinking about Homeric poetry.');
		Utils.setMetaImage(`${location.origin}/images/apotheosis_homer.jpg`);

		return (

			<div className="page page-about content primary">

				<section className="block header header-page	cover parallax">
					<div className="background-image-holder blur-2--no-remove remove-blur	blur-10">
						<img
							role="presentation"
							className="background-image"
							src="/images/apotheosis_homer.jpg"
						/>
					</div>
					<div className="block-screen brown" />

					<div className="container v-align-transform">

						<div className="grid inner">
							<div className="center-content">

								<div className="page-title-wrap">
									<h2 className="page-title ">About the Commentary</h2>
								</div>


							</div>
						</div>
					</div>
				</section>
				<section className="page-content">


					<p>
						The intellectual goal of the original editors is simple and at
						the same time most ambitious: of all existing commentaries on Homeric poetry,
						this project is the first and only such commentary that is based squarely on
						the cumulative research of Milman Parry and his student, Albert Lord, who created
						a new way of thinking about Homeric poetry. Both Parry and Lord taught at Harvard
						University (Parry died prematurely in 1935, when he was still an assistant professor,
						while Lord was a distinguished Emeritus Professor at the time of his death in 1991).
						The lifelong research of Parry (collected papers: 1971) and Lord (1960; second edition
						2000 by Stephen Mitchell and Gregory Nagy, with new introduction), as summarized
						in Lord’s magisterial synthesis, <em>The Singer of Tales</em> (1960), proved that
						Homeric poetry is a <strong>system</strong> generated from oral traditions,
						and that the building blocks of this system are <strong>formulas</strong> on the
						level of form and <strong>themes</strong> on the level of meaning (Lord 1960:4).
						Our	commentary is designed to analyze and explain this system of formulas and themes,
						to which we	refer short-hand as a <strong>formulaic system</strong>.
						Such a system can best be visualized as	a specialized language that has its
						own specialized grammar. And, just as the grammar of any language is a system
						in its own right, so also the linguistic analysis of any grammar needs to
						be correspondingly systematic. Our Homer commentary offers such a systematic analysis.
					</p>
					<p>
						In this commentary we apply to the formulaic system of Homeric poetry
						a special methodology of linguistics that stems primarily from the research
						of Antoine Meillet and of his teacher, Ferdinand de Saussure. Our application
						of this methodology (as exemplified by Meillet 1925 and	Saussure 1916)
						had been pioneered by Parry himself, who was a student of Meillet, during his
						years as a doctoral candidate at the Sorbonne. The intellectual legacy of
						Meillet is continued to this day at the Sorbonne by researchers like Charles
						de Lamberterie, who is a partner in our	project (for more on the influence of
						Meillet on Parry, we refer to de Lamberterie 1997). It is also continued by
						the four principal editors of this project (David Elmer, Douglas Frame,
						Leonard Muellner, Gregory Nagy), the latter three of whom had been students
						of Albert Lord in the 1960s.

					</p>
					<p>
						Our linguistic approach in analyzing both synchronically and diachronically
						the formulaic system of Homeric poetry, in other words, in analyzing the system
						as a static phenomenon as well as an evolving one, provides an empirical foundation
						for the discoveries and discovery procedures that we assemble and organize
						in our Homer commentary. Such an approach does not ignore, however, the	beauty
						of the verbal art that went into the making of Homeric poetry. As the four original
						authors of this Homer commentary, we follow the example of Roman Jakobson
						(in the 1960s, three of us were his students as well as Lord’s),
						whose research in both linguistics and literature showed that there is another
						side to the grammar of poetry: it is the poetry of grammar (as reflected in the
						title of one of his books: Jakobson 1980). The formulaic system of Homeric poetry is
						not a machine but a special language for expressing the sublime beauty and pleasure of
						hearing the ‘glories’ or <em>klea</em> of heroes and gods.
					</p>
					<p>
						The four original authors of the basic running commentary (David Elmer,
						Douglas Frame, Leonard Muellner, Gregory Nagy) are all senior researchers
						in the field of Homeric poetry. Every paragraph of this commentary will
						feature an author-stamp and date-stamp. These principal	authors are writing
						their commentary as a collaborative process, and the collaborators include a
						wider team of associate editors who represent two or even three younger generations of
						researchers who have already agreed to join the project (Maša Čulumovič, Casey Dué,
						Mary Ebbott, Charles de Lamberterie, Olga Levaniouk, Richard Martin, Anita Nikkanen,
						Yiannis Petropolous, Dan Cline, and others). The principal authors have invited their
						younger peers to respond to	selected parts of the text that correspond to these
						researchers’ areas of special expertise. As	in the case of the principal authors,
						every paragraph written by contributing authors features an author-stamp and date-stamp.
					</p>
					<h2>
						Bibliography
					</h2>
					<p>
						Jakobson, R. 1980. <em>Selected Writings III: Poetry of Grammar and
						Grammar of Poetry</em>.	Preface by S. Rudy. The Hague.
					</p>
					<p>
						Lamberterie, C. de. 1997. “Milman Parry et Antoine Meillet.”
						In Létoublon 1997:9–22.	Translated as “Milman Parry and Antoine Meillet”
						in Loraux, Nagy, and Slatkin 2001:409–421.
					</p>
					<p>
						Lord, A. B. 1960. <em>The Singer of Tales</em>. Harvard Studies
						in Comparative Literature 24. Cambridge, MA. See also Lord 2000.
					</p>
					<p>
						Lord, A. B. 2000. 2nd ed. of Lord 1960. Edited, with new Introduction
						(vii–xxix) by S. Mitchell and G. Nagy. Cambridge, MA.
					</p>
					<p>
						Meillet, A. 1921–1936. <em>Linguistique historique et linguistique générale</em>.
						I–II. Paris.
					</p>
					<p>
						Meillet, A. 1925. <em>La méthode comparative en linguistique historique</em>. Paris.
					</p>
					<p>
						Parry, A., ed. 1971. <em>The Making of Homeric Verse: The Collected
						Papers of Milman Parry</em>. Oxford.
					</p>
					<p>
						Saussure, F. de. 1916. <em>Cours de linguistique générale</em>.
						Critical ed. 1972 by T. de Mauro. Paris.
					</p>

				</section>


				<CommentsRecent />

			</div>


		);
	},
});
