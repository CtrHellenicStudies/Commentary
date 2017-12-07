import { Meteor } from 'meteor/meteor';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';


// Meteor public settings
const settings = Meteor.settings.public;

// Network interface for react graphql client
const uriAddress = settings.REACT_APP_GRAPHQL_SERVER ? settings.graphql : 'http://ahcip.orphe.us/graphql';
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
