import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { CookiesProvider } from 'react-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ApolloProvider, createNetworkInterface } from 'react-apollo';
import { ApolloClient } from 'apollo-client';

// static content
import 'ion-rangeslider/js/ion.rangeSlider.js';
import 'ion-rangeslider/css/ion.rangeSlider.css';
import 'ion-rangeslider/css/ion.rangeSlider.skinFlat.css';
import 'mdi/css/materialdesignicons.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'normalize.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import apolloClient from './middleware/apolloClient';
import './index.css';
import "./less/main.css";

// setup dotenv
require('dotenv').config();

// inject material ui tap event (will be able to be removed in later version)
injectTapEventPlugin();

// configure store
const store = configureStore();

// render the application
ReactDOM.render(
<ApolloProvider
	client={apolloClient}
	store={store}
>
	<MuiThemeProvider>
		<CookiesProvider>
			<App />
		</CookiesProvider>
	</MuiThemeProvider>
</ApolloProvider>
, document.getElementById('root'));
registerServiceWorker();