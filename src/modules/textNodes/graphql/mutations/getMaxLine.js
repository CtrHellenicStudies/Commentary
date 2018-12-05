import { gql, graphql } from 'react-apollo';

const getMaxLine = gql`
mutation getMaxLine($workSlug: String! $subworkN: Int!) {
	getMaxLine(workSlug: $workSlug subworkN: $subworkN)
}
`;

const getMaxLineMutation = graphql(getMaxLine, {
	name: 'getMaxLine',
	props: (params) => ({
		getMaxLine: (workSlug, subworkN) => params.getMaxLine({variables: {workSlug: workSlug, subworkN: subworkN}}),
	}),
});

export default getMaxLineMutation;