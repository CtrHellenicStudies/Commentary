Comments._ensureIndex({
	'$**': 'text',
});

Comments._ensureIndex({
	'keywords._id': 1,
});

TextNodes._ensureIndex({
	"work.slug": 1,
	"subwork.n": 1,
	"text.n": 1
});