
const parseJSONLiteral = (ast) => {
	switch (ast.kind) {
	case Kind.STRING:
	case Kind.BOOLEAN:
		return ast.value;
	case Kind.INT:
	case Kind.FLOAT:
		return parseFloat(ast.value);
	case Kind.OBJECT: {
		const value = Object.create(null);
		ast.fields.forEach((field) => {
			value[field.name.value] = parseJSONLiteral(field.value);
		});
		return value;
	}
	case Kind.LIST:
		return ast.values.map(parseJSONLiteral);
	default:
		return null;
	}
}

const JSONType = {
	__parseLiteral: parseJSONLiteral,
	__serialize: value => value,
	__parseValue: value => value,
};

export default JSONType;
