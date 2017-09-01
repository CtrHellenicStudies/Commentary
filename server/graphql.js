import express from 'express';
import bodyParser from 'body-parser';
import { makeExecutableSchema } from 'graphql-tools';
import { apolloExpress } from 'apollo-server';
import proxyMiddleware from 'http-proxy-middleware';
import { graphiqlExpress } from 'graphql-server-express';
import { GraphQLSchema } from 'graphql';
import { maskErrors } from 'graphql-errors';
import { formatError } from 'apollo-errors';

// graphql resources
import RootQuery from '/imports/graphql/queries/rootQuery';
import RootMutation from '/imports/graphql/mutations/rootMutation';
import RootSubscription from '/imports/graphql/subscriptions/rootSubscription';


/**
 * Root schema
 * @type {GraphQLSchema}
 */

const getGraphglContext = req => ({
		// token: req.body.token,
		// TODO: change that to the actual token
	token: 'testtoken'
});

const RootSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
	subscription: RootSubscription,
});

// mask error messages
maskErrors(RootSchema);


const GRAPHQL_PORT = 4000;

const graphQLServer = express();

graphQLServer.use('/graphql', bodyParser.json(), apolloExpress(req => ({
	schema: RootSchema,
	formatError,
	context: getGraphglContext(req),
})));
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.listen(GRAPHQL_PORT);
WebApp.rawConnectHandlers.use(proxyMiddleware(`http://localhost:${GRAPHQL_PORT}/graphql`));
