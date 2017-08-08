export const Meteor = { // eslint-disable-line
	Collection: function collection() {
		this.attachSchema = () => {};
		this.friendlySlugs = () => {};
		this.attachBehaviour = () => {};
		this.allow = () => {};
		this.before = {
			insert: () => {},
			update: () => {},
		};
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
		find: () => { return { fetch: () => {}}},
		update: () => {},
		remove: () => {},
	},
	user: () => ({}),
	userId: () => {},
	subscribe: () => {
		const handle = {
			ready: () => false,
		};
		return handle;
	},
	methods: () => {},
	Error: Error,
};
