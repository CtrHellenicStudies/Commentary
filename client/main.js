import injectTapEventPlugin from 'react-tap-event-plugin';

// startup config
import '/imports/startup/startup';

// onTouchTab init:
injectTapEventPlugin();

// TODO: remove
React.render = ReactDOM.render; // eslint-disable-line
