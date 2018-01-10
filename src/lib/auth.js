import Cookies from 'js-cookie';


const userLoggedIn = () => {
	const token = Cookies.get('token');

	if (token) return true;
	return false;
};

const login = async (data) => {
	if (userLoggedIn()) return null;

	try {
		const res = await fetch(`http://localhost:3002/auth/login`, {
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
            console.log(res);
			throw new Error(res.statusText);
		}
		const resJson = await res.json();
		if (resJson.token) {
			const domain = process.env.REACT_APP_COOKIE_DOMAIN || 'ahcip.local';
			Cookies.set('token', resJson.token, { domain });
			return resJson;
		}
	} catch (err) {
		throw err;
	}
};

const logoutUser = async () => {
	Cookies.remove('user');
};

const register = async (data) => {
	if (userLoggedIn()) return null;

	try {
		const res = await fetch(`http://localhost:3002/auth/register`, {
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
			// TODO: Add domain: 'orphe.us' options to cookie for cross hostname auth
			const domain = process.env.REACT_APP_COOKIE_DOMAIN || 'ahcip.local';
			Cookies.set('token', resJson.token, { domain });
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
	const token = Cookies.get('token');
	if (token) {
		try {
			const res = await fetch(`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_VERIFY_TOKEN_URI}`, {
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
			console.error(err);
		}
	}
	return null;
};

export { login, logoutUser, register, verifyToken };
