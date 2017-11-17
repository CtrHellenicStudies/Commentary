import { Meteor } from 'meteor/meteor';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';


// Meteor public settings
const settings = Meteor.settings.public;

// Network interface for react graphql client
const networkInterface = createNetworkInterface({
	uri: `${settings.REACT_APP_GRAPHQL_SERVER}/${settings.REACT_APP_GRAPHQL_URI}`,
});

/**
 * Connection to graphql server
 * @type {ApolloClient}
 */
const client = new ApolloClient({
	networkInterface,
});

export default client;
