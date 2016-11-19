Meteor.methods({
	textServer(query) {
		check(query, Object);
		try {
			let url = 'http://localhost:8000';

			/*
			 if( location.hostname.indexOf("dev") >= 0 || location.hostname.indexOf("localhost") >= 0){
			 url += location.hostname;
			 url += ':3000';

			 }else {
			 url += "ahcip-text.chs.harvard.edu";
			 url += ':80';

			 }
			 */

			url += '/api';

			const promise = HTTP.get(url, {
				params: query,
			});

			return promise.then(response => {
				const editions = [];
				let isInEdition = false;

				if ('res' in response.data) {
					response.data.res.forEach((textObject) => {
						textObject.text.forEach((textEdition) => {
							editions.forEach((edition) => {
								if (textEdition.edition.slug === edition.slug) {
									isInEdition = true;

									edition.lines.push(textEdition);
								}
							});

							if (!isInEdition) {
								editions.push({
									title: textEdition.edition.title,
									slug: textEdition.edition.slug,
									lines: [textEdition],

								});
							}
						});
					});
					return editions;
				}
				console.error('Unable to connect to TextServer');
				return null;
			});
		} catch (error) {
			console.log(error);
			return null;
		}
	},

});
