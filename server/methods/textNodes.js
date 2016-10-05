Meteor.methods({
    getMaxLine: function(workSlug, subwork_n) {

        var maxLine = TextNodes.aggregate([{
            $match: {
                'work.slug': workSlug,
                'subwork.n': subwork_n,
            }
        }, {
            $group: {
                _id: 'maxLine',
                maxLine: {
                    $max: '$text.n'
                }
            }
        }]);

        return maxLine[0].maxLine[0]; // granted that all text.editions have the same max line number
    },
});