this.AdminConfig = {
	name: Config.name,
	skin: 'blue',
	collections: {
		Comments: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Commenter',
					name: 'commenters[0].name',
				},
				{
					label: 'Work',
					name: 'work.title',
				},
				{
					label: 'Subwork',
					name: 'subwork.n',
				},
				{
					label: 'Line From',
					name: 'lineFrom',
				},
				{
					label: 'Line To',
					name: 'lineTo',
				},
			],
		},
		Commenters: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Name',
					name: 'name',
				},
			],
		},
		Works: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
		Keywords: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
		DiscussionComments: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
		Pages: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
		ReferenceWorks: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
		Settings: {
			color: 'blue',
			icon: 'cog',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
	},
	dashboard: {
		homeUrl: '/admin',
	},
	autoForm: {
		omitFields: ['created', 'updated', 'createdAt', 'updatedAt'],
	},
};
