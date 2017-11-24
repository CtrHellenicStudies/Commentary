import { gql, graphql } from 'react-apollo';

const query = gql`
query editionsQuery {
  editions {
  _id
  title
  slug
  }
}
`;
// const editionsRemove = gql`
// mutation editionsRemove($id: String!) {
//     editionsRemove(_id: $id){
//         _id
//     }
// }
// `;
// const editionsInsert = gql`
// mutation editionsInsert() {
//     editionsRemove()
// }
// `;

// const editionsRemoveMutation = graphql(editionsRemove, {
// 	props: (params) => ({
// 		editionsRemove: (id) => params.commentRemoveMutation({variables: {id}}),
// 	}),
// 	name: 'editionsRemoveMutation',
// 	options: {
// 		refetchQueries: ['editionsQuery']
// 	}
// });
const editionsQuery = graphql(query, {
	name: 'editionsQuery'
});
export { editionsQuery };
