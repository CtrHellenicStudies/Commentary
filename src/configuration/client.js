import { ApolloClient, createNetworkInterface } from 'react-apollo';


const settings = process.env;

// Network interface for react graphql client
const uriAddress = settings.REACT_APP_GRAPHQL ? settings.REACT_APP_GRAPHQL : 'http://ahcip.orphe.us/graphql';
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
