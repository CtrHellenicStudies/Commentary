/*
 * Perform functions necessary on route load
 *
 */
function onRouteLoad() {
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
