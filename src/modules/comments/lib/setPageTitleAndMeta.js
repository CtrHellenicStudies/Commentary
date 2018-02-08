import Utils from '../../../lib/utils';

/**
 * Set page title and meta
 */
const setPageTitleAndMeta = (filters, settings, commentGroups, worksQuery) => {
	let title = '';
	let values = [];
	const workDefault = 'Commentary';
	let work = '';
	let passage = '';
	let metaSubject = 'Commentaries on Classical Texts';
	let description = '';

	if (!settings) {
		return null;
	}

	filters.forEach((filter) => {
		values = [];
		switch (filter.key) {
		case 'works':
			filter.values.forEach((value) => {
				values.push(value.slug);
			});
			work = values.join(', ');
			break;

		case 'passage':
			passage = filter.values[0];
			break;
		}
	});

	const foundWork = worksQuery.loading ? {} : worksQuery.works.find(x => x.slug === work)
	if (foundWork) {
		title = foundWork.title;
	} else {
		title = workDefault;
	}

	if (passage) {
		title = `${title}.${passage}`;
	}

	title = `${title} | ${settings.title || ''}`;

	metaSubject = `${metaSubject}, ${title}, Philology`;

	if (
		commentGroups.length
		&& commentGroups[0].comments.length
		&& commentGroups[0].comments[0].revisions.length
	) {
		description = Utils.trunc(commentGroups[0].comments[0].revisions[0].text, 120);
	}

	Utils.setMetaTag('name', 'subject', 'content', metaSubject);
	Utils.setTitle(title);
	Utils.setDescription(`Commentary on ${title}: ${description}`);
	Utils.setMetaImage();
};

export default setPageTitleAndMeta;
