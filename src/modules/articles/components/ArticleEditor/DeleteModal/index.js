import React from 'react';
import Modal from 'react-modal';

import './DeleteModal.css';

const DeleteModal = ({ deleteModalOpen, closeDeleteModal, handleRemove }) => {


	return (
		<Modal
			isOpen={deleteModalOpen}
			onRequestClose={closeDeleteModal}
			contentLabel="Remove post"
			style={{
  			 overlay: {
  				 position: 'fixed',
  				 zIndex: 26,
  				 top: 0,
  				 left: 0,
  				 right: 0,
  				 bottom: 0,
  				 backgroundColor: 'rgba(0, 0, 0, 0.75)'
  			 },
  			 content: {
  				 position: 'relative',
  				 top: '25%',
  				 left: 0,
  				 right: 0,
  				 bottom: 0,
  				 border: '1px solid #ccc',
  				 background: '#eae9e8',
  				 overflow: 'auto',
  				 WebkitOverflowScrolling: 'touch',
  				 borderRadius: '4px',
  				 outline: 'none',
  				 padding: '4%',
  				 margin: '0 25%'
  			 }
  		 }}
  	 >

			<div className="modalContainer">
				<div className="modalContentContainer">
					<p className="modalContent">Are you sure you want to delete this post?</p>
					<p className="modalContent warningContent">Warning: Once you delete the post, it's gone! There's no way to recover it.</p>
					<p className="modalContent">Instead of deleting, you can leave the post and simply unpublish it to remove it from public view.</p>
					<div className="deleteButtonContainer">
						<button
							className="permanentDelete"
							type="button"
							onClick={handleRemove}
						>
							<img src="/images/baseline-warning-24px.svg" alt="warning icon"/>Yes, delete permanently
						</button>
						<button
							className="cancelDelete"
							onClick={closeDeleteModal}
							type="button"
  					>
  						Cancel, don't delete.
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

export default DeleteModal;
