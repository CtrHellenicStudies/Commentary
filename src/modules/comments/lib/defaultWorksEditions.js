const defaultWorksEditions = {
	ahcip: {
		defaultWorkUrn: 'urn:cts:greekLit:tlg0012.tlg001',
		defaultVersionUrn: 'urn:cts:greekLit:tlg0012.tlg001.chs-1920DavidBMunroThomasWAllenOxoniiETypographeoClarendoniano',
		works: [{
			english_title: 'Iliad',
			slug: 'iliad',
			urn: 'urn:cts:greekLit:tlg0012.tlg001',
			refsDecls: [{
				label: 'Book',
				slug: 'book',
			}, {
				label: 'Line',
				slug: 'line',
			}],
		}, {
			english_title: 'Odyssey',
			slug: 'odyssey',
			urn: 'urn:cts:greekLit:tlg0012.tlg002',
			refsDecls: [{
				label: 'Book',
				slug: 'book',
			}, {
				label: 'Line',
				slug: 'line',
			}],
		}, {
			english_title: 'Homeric Hymns',
			slug: 'homeric-hymns',
			urn: 'urn:cts:greekLit:tlg0013.tlg001',
			refsDecls: [{
				label: 'Hymn',
				slug: 'hymn',
			}, {
				label: 'Line',
				slug: 'line',
			}],
		}],
	},

	pindar: {
		defaultWorkUrn: 'urn:cts:greekLit:tlg0033.tlg001',
		defaultVersionUrn: 'urn:cts:greekLit:tlg0033.tlg001.chs-pindarCreatorSandysJohnEdwinSir18441922Editor',
		works: [{
			english_title: 'Olympian',
			slug: 'olympian',
			urn: 'urn:cts:greekLit:tlg0033.tlg001',
			refsDecls: [{
				label: 'Work',
				slug: 'work',
			}, {
				label: 'Scroll',
				slug: 'scroll',
			}],
		}, {
			english_title: 'Pythian',
			slug: 'pythian',
			urn: 'urn:cts:greekLit:tlg0033.tlg002',
			refsDecls: [{
				label: 'Work',
				slug: 'work',
			}, {
				label: 'Scroll',
				slug: 'scroll',
			}],
		}, {
			english_title: 'Nemean',
			slug: 'nemean',
			urn: 'urn:cts:greekLit:tlg0033.tlg003',
			refsDecls: [{
				label: 'Work',
				slug: 'work',
			}, {
				label: 'Scroll',
				slug: 'scroll',
			}],
		}, {
			english_title: 'Isthmean',
			slug: 'isthmean',
			urn: 'urn:cts:greekLit:tlg0033.tlg004',
			refsDecls: [{
				label: 'Work',
				slug: 'work',
			}, {
				label: 'Scroll',
				slug: 'scroll',
			}],
		}],
	},

	pausanias: {
		defaultWorkUrn: 'urn:cts:greekLit:tlg0525.tlg001',
		defaultVersionUrn: 'urn:cts:greekLit:tlg0525.tlg001',
		works: [{
			english_title: 'Description of Greece',
			slug: 'description-of-greece',
			urn: 'urn:cts:greekLit:tlg0525.tlg001',
			refsDecls: [{
				label: 'Book',
				slug: 'book',
			}, {
				label: 'Chapter',
				slug: 'chapter',
			}, {
				label: 'Section',
				slug: 'section',
			}],
		}],
	},
};

export default defaultWorksEditions;