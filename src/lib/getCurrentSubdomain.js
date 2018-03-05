const getCurrentSubdomain = () => {
	let subdomain = null;

	if (
		window
		&& window.location.hostname
	) {
		subdomain = window.location.hostname.split('.')[0];
	}

	return subdomain;
};

export default getCurrentSubdomain;
