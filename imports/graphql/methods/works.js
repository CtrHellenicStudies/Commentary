import { gql, graphql } from 'react-apollo';

const query = gql`
query worksQuery {
  works {
    _id
    title
    tenantId
    tlgCreator
    tlg
    slug
    order
    nComments
    subworks {
      title
      slug
      n
      tlgNumber
      nComments
      commentHeatmap
    }
  }
}
`;
const worksQuery = graphql(query, {
	name: 'worksQuery'
});

export {worksQuery};
