import { GraphQLList, GraphQLID } from 'graphql';
import SchemaBridge from 'meteor/kuip:schema-graphql-bridge';

// models
import ReferenceWorks from '/imports/models/referenceWorks';


const ReferenceWorkType = SchemaBridge.schema(
	ReferenceWorks.schema,
	'ReferenceWork'
);


export default ReferenceWorkType;
