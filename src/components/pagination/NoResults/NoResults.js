import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';





const NoResults = ({ message }) => (
	<Grid>
		<Row>
			<Col>
				<div className="noResults">
					<p>
						{message}
					</p>
				</div>
			</Col>
		</Row>
	</Grid>
);

export default NoResults;
