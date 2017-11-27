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

const networkInterface = createNetworkInterface({
	uri: Meteor.settings.public.graphql,
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

Meteor.startup(() => {
	// injectTapEventPlugin();
	render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('app'));
});

