const parseMultilineVersion = (versions, multiline) => {
	const parsedVersions = [];

	versions.forEach((version, index) => {
		const joinedText = version.lines.map(line => line.html).join(' ');

		const tag = new RegExp(`<lb id="\\d+" ed="${multiline}" />`, 'ig');

		const textArray = joinedText.split(tag);
		const parser = new Parser();

		const lineArray = [];
		parser.addRule(/id="\d+"/ig, (arg1) => {
			lineArray.push(arg1);
		});
		parser.render(joinedText);

		const numberArray = lineArray.map((line) => parseInt(line.substr(4, line.length - 2), 10));

		if (numberArray.length) {
			numberArray.unshift(numberArray[0] - 1);
		}

		const result = [];

		if (textArray.length === numberArray.length) {
			for (let i = 0; i < textArray.length; i++) {
				const currentLine = {
					html: textArray[i],
					n: numberArray[i]
				};
				result.push(currentLine);
			}
		} else {
			return new Error('Parsing error');
		}

		const currentVersion = version;
		currentVersion.lines = result;
		parsedVersions.push(currentVersion);
	});

	return parsedVersions;
};

export default parseMultilineVersion;
