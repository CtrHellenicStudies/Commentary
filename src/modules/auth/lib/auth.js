import Cookies from 'universal-cookie';

const cookies = new Cookies();


const userIsLoggedIn = () => {
	const token = cookies.get('token');

	if (token) return true;
	return false;
};

const loginUser = async (data) => {
	if (userIsLoggedIn()) {
		await logoutUser();
		// throw new Error('User tried to login but user is already logged in');
	}

	try {
		const res = await fetch(`${process.env.REACT_APP_AUTHENTICATION_API}/auth/login`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...data
			})
		});

		const resJson = await res.json();

		if (!res.ok) {
			throw new Error(res.statusText);
		}

		if (resJson.redirectTo) {
			window.location = resJson.redirectTo;
		}

		if (resJson.token) {
			const domain = process.env.REACT_APP_COOKIE_DOMAIN || 'chs.harvard.edu';
			cookies.set('token', resJson.token, { domain } );
			return resJson;
		}
	} catch (err) {
		throw err;
	}
};

const logoutUser = () => {
	const domain = process.env.REACT_APP_COOKIE_DOMAIN || 'chs.harvard.edu';
	cookies.remove('token', { domain });
	cookies.remove('hello', { domain });
};

const register = async (data) => {
	if (userIsLoggedIn()) {
		await logoutUser();
		// throw new Error('User tried to register but user is already logged in');
	}

	try {
		const res = await fetch(`${process.env.REACT_APP_AUTHENTICATION_API}/auth/register`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...data
			})
		});

		if (!res.ok) {
			console.error(res);
			throw new Error(res.statusText);
		}

		const resJson = await res.json();
		if (resJson.token) {
			const domain = process.env.REACT_APP_COOKIE_DOMAIN || 'chs.harvard.edu';
			cookies.set('token', resJson.token, { domain });
			return resJson;
		}

		/**
		if (resJson.passwordStrength) {
			throw new Error({
				passwordError: true,
				suggestion: resJson.passwordStrength.feedback.suggestions[0],
			});
		}
		*/

	} catch (err) {
		throw err;
	}
};

const resetPassword = async (data) => {
	if (userIsLoggedIn()) {
		await logoutUser();
		// throw new Error('User tried to register but user is already logged in');
	}

	try {
		const res = await fetch(`${process.env.REACT_APP_AUTHENTICATION_API}/auth/reset-password`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...data
			})
		});

		if (!res.ok) {
			throw new Error(res.statusText);
		}

		const resJson = await res.json();
		if (resJson.token) {
			const domain = process.env.REACT_APP_COOKIE_DOMAIN || 'chs.harvard.edu';
			cookies.set('token', resJson.token, { domain });
			return resJson;
		}

		if (resJson.passwordStrength) {
			throw new Error({
				passwordError: true,
				suggestion: resJson.passwordStrength.feedback.suggestions[0],
			});
		}

	} catch (err) {
		throw err;
	}
};

const verifyToken = async () => {
	const token = cookies.get('token');
	if (token) {
		try {
			const res = await fetch(`${process.env.REACT_APP_AUTHENTICATION_API}/auth/verify-token`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					authorization: token,
				}
			});
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			return res.json();
		} catch (err) {
			const domain = process.env.REACT_APP_COOKIE_DOMAIN || 'chs.harvard.edu';
			cookies.remove('token', { domain });
			cookies.remove('hello', { domain });

			console.error(err);
		}
	}
	return null;
};

export { loginUser, logoutUser, register, verifyToken, userIsLoggedIn, resetPassword };
