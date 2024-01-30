import React from "react";
import PropTypes from 'prop-types';

const DeleteModal = ({ isOpen, onCancel, onConfirm }) => {
    return (
        <div className={`fixed inset-0 overflow-auto  ${isOpen ? "block" : "hidden"}`}>
            <div className="delete-modal-wrapper">
                <div className="delete-modal-background">
                    <div className="delete-modal-opacity"></div>
                </div>

                <div className="delete-modal-body">
                    <div className="delete-modal-container">
                        <div className="delete-modal-content-div">
                            <div className="delete-modal-content">
                                <h3 className="delete-modal-confirm">Confirm Deletion</h3>
                                <div className="mt-2">
                                    <p className="delete-modal-message">
                                        Are you sure you want to delete this item?
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-button-container">
                        <span className="modal-button-span">
                            <button type="button" onClick={onConfirm} className="delete-modal-button">
                                Delete
                            </button>
                        </span>
                        <span >
                            <button type="button" className="modal-cancle-button" onClick={onCancel}>
                                cancle
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
};

DeleteModal.prototype = {
    isOpen: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
}

export default DeleteModal;