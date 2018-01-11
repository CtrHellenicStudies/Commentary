import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "./less/main.css";
import 'ion-rangeslider/js/ion.rangeSlider.js';
import 'ion-rangeslider/css/ion.rangeSlider.css';
import 'ion-rangeslider/css/ion.rangeSlider.skinFlat.css';
import 'mdi/css/materialdesignicons.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'normalize.css';
import injectTapEventPlugin from 'react-tap-event-plugin';


// css

import Cookies from 'js-cookie';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider, createNetworkInterface } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
require('dotenv').config();

injectTapEventPlugin();

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
