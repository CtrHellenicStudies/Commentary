import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import { connect } from 'react-redux';

import { handleRequestCloseSnack } from '../../actions';



const SnackbarContainer = props => {

	return (
		<Snackbar
			open={props.open}
			message={props.message}
			onRequestClose={props.handleRequestClose}
			autoHideDuration={4000}
		/>
	);
};


const mapStateToProps = state => ({
	message: state.snackbar.message,
	open: state.snackbar.open,
});

const mapDispatchToProps = dispatch => ({
	handleRequestClose: () => {
		dispatch(handleRequestCloseSnack());
	},
});


export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SnackbarContainer);
