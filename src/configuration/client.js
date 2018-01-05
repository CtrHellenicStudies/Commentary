import { ApolloClient, createNetworkInterface } from 'react-apollo';


const settings = process.env;

// Network interface for react graphql client
const uriAddress = settings.REACT_APP_GRAPHQL_SERVER ? settings.GRAPHQL : 'http://ahcip.orphe.us/graphql'; // TODO
const networkInterface = createNetworkInterface({
	uri: uriAddress,
});

/**
 * Connection to graphql server
 * @type {ApolloClient}
 */
const client = new ApolloClient({
	networkInterface,
});

export default client;
