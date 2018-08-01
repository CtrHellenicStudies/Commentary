import React from 'react';
import { Link } from 'react-router-dom';

import './UpdateForV2Message.css';


const UpdateForV2Message = () => (
	<div className="authContainer">
		<div className="at-form">
			<div className="at-pwd-form updateForV2Message">
				<div className="at-title">
					<h3>
            Welcome to the Center for Hellenic Studies Classical Commentaries Version 2.0
					</h3>
					<p>
            Please check your email to reset your password to login to the new version of the CHS Commentaries. We apologize for any inconvenience this may cause.
					</p>
					<p>
            In the meantime, you can <Link to="/commentary">go to the commentary</Link> or <Link to="/">back home</Link>.
					</p>
				</div>
			</div>
		</div>
	</div>
);

export default UpdateForV2Message;
