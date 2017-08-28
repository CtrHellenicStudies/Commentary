import { Meteor } from 'meteor/meteor';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';


const settings = Meteor.settings.public;

const networkInterface = createNetworkInterface({
	uri: `${settings.REACT_APP_GRAPHQL_SERVER}/${settings.REACT_APP_GRAPHQL_URI}`,
});

/*
networkInterface.use([{
	applyMiddleware(req, next) {
		if (!req.options.headers) {
			req.options.headers = {}; // Create the header object if needed.
		}
		req.options.headers['authorization'] = localStorage.getItem('token') ? localStorage.getItem('token') : null;
		next();
	}
}]);

const connectionParams = () => {
	return { authToken: localStorage.getItem('token') ? localStorage.getItem('token') : null };
};

const wsClient = new SubscriptionClient(`${settings.REACT_APP_WS_SERVER}/${settings.REACT_APP_WS_SERVER_URI}`, {
	reconnect: true,
	connectionParams,
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
	networkInterface,
	wsClient
);
*/

const client = new ApolloClient({
	networkInterface,
});

export default client;
export { wsClient };
