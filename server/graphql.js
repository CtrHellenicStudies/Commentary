import express from 'express';
import bodyParser from 'body-parser';
import { makeExecutableSchema } from 'graphql-tools';
import { apolloExpress } from 'apollo-server';
import proxyMiddleware from 'http-proxy-middleware';
import { graphiqlExpress } from 'graphql-server-express';
import { GraphQLSchema } from 'graphql';
import { maskErrors } from 'graphql-errors';
import { formatError } from 'apollo-errors';
import cors from 'cors';

// graphql resources
import RootQuery from '/imports/graphql/queries/rootQuery';
import RootMutation from '/imports/graphql/mutations/rootMutation';
import RootSubscription from '/imports/graphql/subscriptions/rootSubscription';


/**
 * Root schema
 * @type {GraphQLSchema}
 */
const RootSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
	subscription: RootSubscription,
});

// mask error messages
maskErrors(RootSchema);


/**
 * Create graphql express server
 */
const GRAPHQL_PORT = 4000;
const graphQLServer = express();

/**
 * Pass auth token into context
 */
const getGraphglContext = req => ({token: req.headers.authorization});

const whitelist = [
	/chs\.local:\d+$/,
	/\.chs\.local:\d+$/,
	/orphe\.us$/,
	/\.orphe\.us$/,
	/chs\.harvard\.edu$/,
	/\.chs\.harvard\.edu$/,
];

/**
 * Set cors options
 */
const corsOptions = {
	origin: (origin, callback) => { callback(null, true); }, // Disable CORs for the moment while development environment is changing
};

graphQLServer.use(cors(corsOptions));

graphQLServer.use('/graphql', bodyParser.json(), apolloExpress(req => ({
	schema: RootSchema,
	formatError,
	context: getGraphglContext(req),
})));

graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.listen(GRAPHQL_PORT);
WebApp.rawConnectHandlers.use(proxyMiddleware(`http://localhost:${GRAPHQL_PORT}/graphql`));
