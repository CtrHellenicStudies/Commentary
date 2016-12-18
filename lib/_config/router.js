/*
 * Perform functions necessary on route load
 *
 */
function onRouteLoad() {
	// Initialize headroom
	setTimeout(() => {
		const elem = document.querySelector('header');
		if (elem) {
			const headroom = new Headroom(elem);
			headroom.init();
		}
	}, 300);

	// Append .background-image-holder <img>'s as CSS backgrounds
	setTimeout(() => {
		$('.background-image-holder').each((i, elem) => {
			const imgSrc = $(elem).children('img').attr('src');
			$(elem).css('background', `url("${imgSrc}")`);
			$(elem).children('img').hide();
			$(elem).css('background-position', 'initial');
			$(elem).addClass('fadeIn');
		});

		// Fade in background images
		setTimeout(() => {
			$('.remove-blur').removeClass('blur');
			$('.remove-blur').removeClass('blur-10').addClass('blur');
		}, 300);
	}, 500);


	/*
	 * If isn't mobile, init skrollr
	 */
	if (!Utils.isMobile) {
		options = {
			forceHeight: false,
			smoothScrolling: false,
		};
		return skrollr.init(options).refresh();
	}

	return false;
}

// Add onRouteLoad to FlowRouter.triggers.enter callbacks
FlowRouter.triggers.enter([onRouteLoad]);

/*Router.configure({
	layoutTemplate: 'masterLayout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	routeControllerNameConverter: 'camelCase',
});*/
