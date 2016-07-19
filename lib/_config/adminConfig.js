this.AdminConfig = {
  name: Config.name,
  collections: {
    Commenters: {
      color: 'blue',
      icon: 'pencil',
      tableColumns: [
        {
          label: 'Title',
          name: 'title'
        }
      ]
    },
    Comments: {
      color: 'blue',
      icon: 'pencil',
      tableColumns: [
        {
          label: 'Title',
          name: 'title'
        }
      ]
    },
  },
  dashboard: {
    homeUrl: '/dashboard'
  },
  autoForm: {
    omitFields: ['createdAt', 'updatedAt']
  }
};
