import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

// static content
import 'mdi/css/materialdesignicons.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'normalize.css';

import Root from './containers/Root';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import "./less/main.css";

// setup dotenv
require('dotenv').config();

// inject material ui tap event (will be able to be removed in later version)
injectTapEventPlugin();

// configure store
const store = configureStore();

// render the application
ReactDOM.render(
	<Root store={store} />,
	document.getElementById('root'),
);
registerServiceWorker();
