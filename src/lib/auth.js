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



const A = [
	[0, 10, 10, 0, 0, 2, 0],//0
	[0, 0, 0, 0, 5, 0, 0],//1
	[0, -9, 0, -8, 0, 0, 0],//2
	[0, 0, 0, 0, 0, 0, 3],//3
	[0, 0, 4, 0, 0, 0, -4],//4
	[0, 0, 0, 0, 0, 0, 1],//5
	[0, 0, 0, 0, 0, 0, 0]//6
];
const S = 0;
const F = 6;
function yourFunction(A, S, F) {

	const n = A.length;
	const dist = Array(n);
	const pre = Array(n);

	for(let i = 0; i < n; i ++ ) {
		dist[i] = Infinity;
		pre[i] = null;
	}
	for (let i = 0; i < n; i ++) {
		for (let j = 0; j < n; j ++) {
			for(let k = 0; k < n; k ++) {
				if(dist[j] + A[j][k] < dist[k]) {
					dist[k] = A[j][k] + dist[j];
					pre[k] = j;
				}
			}
		}
	}
}


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
