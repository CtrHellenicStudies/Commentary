Meteor.methods({
	getMaxLine(workSlug, subworkN) {
		check(workSlug, String);
		check(subworkN, Number);
		const maxLine = TextNodes.aggregate([{
			$match: {
				'work.slug': workSlug,
				'subwork.n': subworkN,
			},
		}, {
			$group: {
				_id: 'maxLine',
				maxLine: {
					$max: '$text.n',
				},
			},
		}]);

		return maxLine[0].maxLine[0]; // granted that all text.editions have the same max line number
	},

	getTableOfContents() {
		const tableOfContents = TextNodes.aggregate([{
			$group: {
				_id: '$work.slug',
				subworks: {
					$addToSet: '$subwork.n',
				},
			},
		}]);
		tableOfContents.forEach((work) => {
			work.subworks.sort((a, b) => a - b);
		});

		return tableOfContents;
	},
});
