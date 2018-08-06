const userInRole = (currentRoles, roles) => {
	if (!currentRoles) {
		return false;
	}
	for(let i = 0; currentRoles && i < currentRoles.length; i += 1) {
		for(let j = 0; j < roles.length; j += 1) {
			if(currentRoles[i] === roles[j]) {
				return true;
			}
		}
	}
	return false;
};

export default userInRole;
