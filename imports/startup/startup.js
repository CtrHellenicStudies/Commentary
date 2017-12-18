// import styles
import 'ion-rangeslider/js/ion.rangeSlider.js';
import 'ion-rangeslider/css/ion.rangeSlider.css';
import 'ion-rangeslider/css/ion.rangeSlider.skinFlat.css';
import 'mdi/css/materialdesignicons.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import Cookies from 'js-cookie/src/js.cookie.js';

// lib
import '/imports/lib/_config/accounts';
import '/imports/lib/_config/emails';
import '/imports/lib/_config/i18n';
import '/imports/lib/_config/oauth';

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ApolloProvider, createNetworkInterface } from 'react-apollo';
import { ApolloClient } from 'apollo-client';

import App from './client/App';

// Setup apollo client network interface (also TODO @ /imports/middleware/apolloClient)
const uriAddress = Meteor.settings.public.graphql ? Meteor.settings.public.graphql : 'http://ahcip.orphe.us/graphql'; // TODO

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

// Get tenant subdomain
const hostnameArray = document.location.hostname.split('.');
let tenantSubdomain;
if (hostnameArray.length > 2) {
	tenantSubdomain = hostnameArray[0];
}

Meteor.startup(() => {
	render(
		<ApolloProvider client={client}>
			<App
				subdomain={tenantSubdomain}
			/>
		</ApolloProvider>,
		document.getElementById('app')
	);
});
