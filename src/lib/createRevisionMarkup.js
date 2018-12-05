/**
 * Create revision markup with cross references in the commentary
 * @param {string} html - an html input string
 * @returns {Object} an object with the processed html output string
 */
const createRevisionMarkup = (html) => {
	let newHtml = html;

	const workNamesSpace = [{
		title: 'Iliad',
		slug: 'tlg001',
	}, {
		title: 'Odyssey',
		slug: 'odyssey',
	}, {
		title: 'Homeric Hymns',
		slug: 'hymns',
	}, {
		title: 'Hymns',
		slug: 'hymns',
	}];
	const workNamesPeriod = [{
		title: 'Il',
		slug: 'tlg001',
	}, {
		title: 'Od',
		slug: 'odyssey',
	}, {
		title: 'HH',
		slug: 'hymns',
	}, {
		title: 'I',
		slug: 'tlg001',
	}, {
		title: 'O',
		slug: 'odyssey',
	}];

	let regex1;
	let regex2;

	workNamesSpace.forEach((workName) => {
		// regex for range with dash (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
		regex1 = new RegExp(`${workName.title} (\\d+).(\\d+)[\\-\\–\\—](\\d+)(?!.*&quot;)`, 'g');

		// regex for no range (and lookahead to ensure range isn't captured) (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
		regex2 = new RegExp(`${workName.title} (\\d+).(?!\\d+[\\-\\–\\—]\\d+)(\\d+)(?!.*&quot;)`, 'g');

		newHtml = newHtml.replace(regex1,
			`<a
				class='has-lemma-reference'
				data-work=${workName.slug}
				data-subwork='$1'
				data-lineFrom='$2'
				data-lineTo='$3'
			>${workName.title} $1.$2-$3</a>`);
		newHtml = newHtml.replace(regex2,
			`<a
				class='has-lemma-reference'
				data-work=${workName.slug}
				data-subwork='$1'
				data-lineFrom='$2'
			>${workName.title} $1.$2</a>`);
	});

	workNamesPeriod.forEach((workName) => {
		// regex for range with dash (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
		regex1 = new RegExp(`([^\\w+])${workName.title}.(\\s*)(\\d+).(\\d+)[\\-\\–\\—](\\d+)(?!.*&quot;)`, 'g');

		// regex for no range (and lookahead to ensure range isn't captured) (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
		regex2 = new RegExp(`([^\\w+])${workName.title}.(\\s*)(\\d+).(?!\\d+[\\-\\–\\—]\\d+)(\\d+)(?!.*&quot;)`, 'g');
		newHtml = newHtml.replace(regex1,
			`$1<a
				class='has-lemma-reference'
				data-work=${workName.slug}
				data-subwork='$3'
				data-lineFrom='$4'
				data-lineTo='$5'
			>${workName.title}.$2$3.$4-$5</a>`);
		newHtml = newHtml.replace(regex2,
			`$1<a
				class='has-lemma-reference'
				data-work=${workName.slug}
				data-subwork='$3'
				data-lineFrom='$4'
			>${workName.title}.$2$3.$4</a>`);
	});

	return { __html: newHtml };
};

export default createRevisionMarkup;
