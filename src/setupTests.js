import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

window.matchMedia = window.matchMedia || function() {
	return {
		matches : false,
		addListener : function() {},
		removeListener: function() {},
	};
};
