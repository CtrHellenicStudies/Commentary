export const Meteor = { // eslint-disable-line
	Collection: function collection() {
		this.attachSchema = () => {};
		this.friendlySlugs = () => {};
		this.attachBehaviour = () => {};
		this.allow = () => {};
		this.find = () => {
			const results = {
				fetch: () => [],
			};

			return results;
		};
		this.findOne = () => {};
	},
	absoluteUrl: () => {},
	users: {
		findOne: () => {},
		find: () => {},
	},
	user: () => {},
	userId: () => {},
	subscribe: () => {
		const handle = {
			ready: () => false,
		};
		return handle;
	},
};
