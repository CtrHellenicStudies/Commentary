import { GraphQLList, GraphQLID } from 'graphql';
import SchemaBridge from 'meteor/kuip:schema-graphql-bridge';

// models
import TextNodes from '/imports/models/textNodes';
import Works from '/imports/models/works';
import Translations from '/imports/models/translations';


const TranslationType = SchemaBridge.schema(
	Translations.schema,
	'Translation'
);

export default TranslationType;
