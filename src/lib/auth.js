import Cookies from 'js-cookie';

const loginService = process.env.LOGIN_SERVICE ? process.env.LOGIN_SERVICE : 'http://localhost:3002/auth/login';
const registerService = process.env.REGISTER_SERVICE ? process.env.REGISTER_SERVICE : 'http://localhost:3002/auth/register';
const userLoggedIn = () => {
	const token = Cookies.get('token');

	if (token) return true;
	return false;
};
const login = async (data) => {
	if (userLoggedIn()) {
		console.log('logged_in');
		return null;
	}

	try {
		const res = await fetch(loginService, {
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
			console.log(atob(resJson.token.split('.')[1]));
            let dataJSON = JSON.parse(atob(resJson.token.split('.')[1]));
			delete dataJSON.password;
			Cookies.set('token', resJson.token);
			Cookies.set('user', dataJSON);
			window.location.reload();
			return resJson;
		}
	} catch (err) {
		return err;
	}
};

const logout = async () => {
	Cookies.remove('user');
	Cookies.remove('token');
	document.location.href="/";
};

const register = async (data) => {
	if (userLoggedIn()) return null;

	try {
		const res = await fetch(registerService, {
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
			console.log(resJson);
            let dataJSON = JSON.parse(atob(resJson.token.split('.')[1]));
			delete dataJSON.password;
			Cookies.set('token', resJson.token);
			Cookies.set('user', dataJSON);
			window.location.reload();
			return resJson;
		}
		if (resJson.passwordStrength) {
			throw new Error({
				passwordError: true,
				suggestion: resJson.passwordStrength.feedback.suggestions[0],
			});
		}
	} catch (err) {
		return err;
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

export { login, logout, register, verifyToken };
