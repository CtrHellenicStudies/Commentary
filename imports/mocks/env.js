import $ from 'jquery';

global.$ = global.jQuery = $;

window.matchMedia = window.matchMedia || function matchMedia() {
	return {
		matches: false,
		addListener: () => {},
		removeListener: () => {}
	};
};
