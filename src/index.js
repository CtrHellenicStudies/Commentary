import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// css
import "./less/main.css";

import Cookies from 'js-cookie';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider, createNetworkInterface } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
require('dotenv').config();
require('dotenv').load();

const uriAddress = process.env.graphql ? process.env.graphql : 'http://localhost:3002/graphql';
console.log(uriAddress);

const networkInterface = createNetworkInterface({
	uri: uriAddress,
});

const client = new ApolloClient({
	networkInterface
});

networkInterface.use([{
	applyMiddleware(req, next) {
		if (!req.options.headers) {
			req.options.headers = {};
		}
		const token = Cookies.get('loginToken');
		req.options.headers.authorization = token;
		next();
	}
}]);

ReactDOM.render(
<ApolloProvider client={client}>
    <App />
</ApolloProvider>
, document.getElementById('root'));
registerServiceWorker();
