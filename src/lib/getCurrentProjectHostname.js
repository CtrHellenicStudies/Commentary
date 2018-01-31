const getCurrentProjectHostname = () => {
	let hostname = null;
	const ahcipHostnames = ['ahcip.chs.harvard.edu', 'ahcip.local', 'localhost'];

	if (
		window
		&& window.location.hostname
		&& !~ahcipHostnames.indexOf(window.location.hostname)
	) {
		hostname = window.location.hostname;
	}

	// regularlize development domain
	if (hostname && hostname.endsWith('ahcip.local')) {
		hostname = hostname.replace('ahcip.local', 'ahcip.chs.harvard.edu');
	}

	return hostname;
};

export default getCurrentProjectHostname;
