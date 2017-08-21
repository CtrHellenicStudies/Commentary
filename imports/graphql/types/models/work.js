import { GraphQLList, GraphQLID } from 'graphql';
import SchemaBridge from 'meteor/kuip:schema-graphql-bridge';

// models
import Works from '/imports/models/works';


const WorkType = SchemaBridge.schema(
	Works.schema,
	'Work',
	{
		wrap: false,
		fields: ['tenantId', 'title', 'slug', 'order', 'nComments'],
	}
);


export default WorkType;
