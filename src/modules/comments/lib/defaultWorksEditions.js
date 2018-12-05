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
				range: [0, 23],
			}, {
				label: 'Line',
				slug: 'line',
				range: [0, 909],
			}],
		}, {
			english_title: 'Odyssey',
			slug: 'odyssey',
			urn: 'urn:cts:greekLit:tlg0012.tlg002',
			refsDecls: [{
				label: 'Book',
				slug: 'book',
				range: [0, 23],
			}, {
				label: 'Line',
				slug: 'line',
				range: [0, 909],
			}],
		}, {
			english_title: 'Homeric Hymns',
			slug: 'homeric-hymns',
			urn: 'urn:cts:greekLit:tlg0013.tlg001',
			refsDecls: [{
				label: 'Hymn',
				slug: 'hymn',
				range: [0, 32],
			}, {
				label: 'Line',
				slug: 'line',
				range: [0, 909],
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
				label: 'Scroll',
				slug: 'scroll',
				range: [0, 13],
			}, {
				label: 'Line',
				slug: 'line',
				range: [0, 299],
			}],
		}, {
			english_title: 'Pythian',
			slug: 'pythian',
			urn: 'urn:cts:greekLit:tlg0033.tlg002',
			refsDecls: [{
				label: 'Scroll',
				slug: 'scroll',
				range: [0, 13],
			}, {
				label: 'Line',
				slug: 'line',
				range: [0, 299],
			}],
		}, {
			english_title: 'Nemean',
			slug: 'nemean',
			urn: 'urn:cts:greekLit:tlg0033.tlg003',
			refsDecls: [{
				label: 'Scroll',
				slug: 'scroll',
				range: [0, 13],
			}, {
				label: 'Line',
				slug: 'line',
				range: [0, 299],
			}],
		}, {
			english_title: 'Isthmean',
			slug: 'isthmean',
			urn: 'urn:cts:greekLit:tlg0033.tlg004',
			refsDecls: [{
				label: 'Scroll',
				slug: 'scroll',
				range: [0, 13],
			}, {
				label: 'Line',
				slug: 'line',
				range: [0, 299],
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
				range: [0, 9],
			}, {
				label: 'Chapter',
				slug: 'chapter',
				range: [0, 99],
			}, {
				label: 'Section',
				slug: 'section',
				range: [0, 99],
			}],
		}],
	},
};

export default defaultWorksEditions;
