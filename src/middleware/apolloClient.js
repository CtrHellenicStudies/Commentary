import { ApolloClient, createNetworkInterface } from 'react-apollo';
// import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import Cookies from 'universal-cookie';


const cookies = new Cookies();

// uri address of graphql endpoint
const uriAddress = process.env.REACT_APP_GRAPHQL_API;

const networkInterface = createNetworkInterface({
	uri: uriAddress,
	opts: {
		credentials: 'include',
	}
});

networkInterface.use([{
	applyMiddleware(req, next) {
		if (!req.options.headers) {
			req.options.headers = {}; // Create the header object if needed.
		}
		req.options.headers.authorization = cookies.get('token') ? cookies.get('token') : null;
		next();
	}
}]);

const client = new ApolloClient({
	networkInterface
});

export default client;
