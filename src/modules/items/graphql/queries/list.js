import { gql, graphql } from 'react-apollo';

const query = gql`
{
  ORPHEUS_project(hostname:"attichydria.orphe.us") {
    _id
    title
    items {
      _id
      title
      projectId
      description
      private
      updatedAt
      createdAt
      slug
      __v
      filesCount
      commentsCount
      files {
        _id
        name
        title
        projectId
        itemId
        type
        path
        thumbPath
        updatedAt
        createdAt
        slug
        __v
      }
    }

  }
}`;


const itemListQuery = graphql(query, {
	name: 'itemListQuery',
});

export default itemListQuery;
