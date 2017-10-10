// import styles
import 'ion-rangeslider/js/ion.rangeSlider.js';
import 'ion-rangeslider/css/ion.rangeSlider.css';
import 'ion-rangeslider/css/ion.rangeSlider.skinFlat.css';
import 'mdi/css/materialdesignicons.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'js-cookie/src/js.cookie.js';

// lib
import '/imports/lib/_config/accounts';
import '/imports/lib/_config/emails';
import '/imports/lib/_config/i18n';
import '/imports/lib/_config/oauth';
import '/imports/lib/router';

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './client/App';

Meteor.startup(() => {
	// injectTapEventPlugin();
	render(<App />, document.getElementById('app'));
});

