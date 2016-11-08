Meteor.methods({
	getMaxLine(workSlug, subwork_n) {
		const maxLine = TextNodes.aggregate([{
			$match: {
				'work.slug': workSlug,
				'subwork.n': subwork_n,
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
		tableOfContents.forEach((work) = > {
			work.subworks.sort(function (a, b) {
			return a - b;
		});
	})
		;

		return tableOfContents;
	},
});
