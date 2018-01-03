import Cookies from 'js-cookie';

const cookies = new Cookies();


const userLoggedIn = () => {
	const token = cookies.get('token');

	if (token) return true;
	return false;
};

const login = async (data) => {
	if (userLoggedIn()) return null;

	try {
		const res = await fetch(`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_LOGIN_URI}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				data
			})
		});
		if (!res.ok) {
			throw new Error(res.statusText);
		}
		const resJson = await res.json();
		if (resJson.token) {
			cookies.set('token', resJson.token);
			return resJson;
		}
	} catch (err) {
		throw err;
	}
};

const logout = async () => {
	cookies.remove('token');
	cookies.remove('hello');
};

const register = async (data) => {
	if (userLoggedIn()) return null;

	try {
		const res = await fetch(`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_REGISTER_URI}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				data
			})
		});
		if (!res.ok) {
			throw new Error(res.statusText);
		}
		const resJson = await res.json();
		if (resJson.token) {
			// TODO: Add domain: 'orphe.us' options to cookie for cross subdomain auth
			cookies.set('token', resJson.token);
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
			throw err;
		}
	}
	return null;
};

export { login, logout, register, verifyToken };
