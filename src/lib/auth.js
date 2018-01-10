import Cookies from 'js-cookie';

const loginService = process.env.LOGIN_SERVICE ? process.env.LOGIN_SERVICE : 'http://localhost:3002/auth/login';
const registerService = process.env.REGISTER_SERVICE ? process.env.REGISTER_SERVICE : 'http://localhost:3002/auth/register';
const userLoggedIn = () => {
	const token = Cookies.get('token');

	if (token) return true;
	return false;
};
const login = async (data) => {
	console.log(loginService);
	console.log(registerService);
	if (userLoggedIn()) {
		console.log('token null');
		Cookies.remove('token');
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
			Cookies.set('token', resJson.token);
			console.log(atob(resJson.token.split('.')[1]));
            let dataJSON = JSON.parse(atob(resJson.token.split('.')[1]));
            delete dataJSON.password;
			Cookies.set('user', dataJSON);
			window.location.reload();
			return resJson;
		}
	} catch (err) {
		throw err;
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
            Cookies.set('token', resJson.token);
            let dataJSON = JSON.parse(resJson.token.split('.')[1]);
            delete dataJSON.password;
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

export { login, logout, register, verifyToken };
