import React from 'react';
import {Modal, Button, Form} from 'react-bootstrap'

const ManageCowsModal = ({number, setNumber, isOpen, onClose, message, userCommons, onBuy, onSell }) => {
    const handleInputChange = (e) => {
        setNumber(e.target.value);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (message.includes('buy')) {
          onBuy(userCommons, number)
      }
      else {
          onSell(userCommons, number)
      }
      setNumber(1);
      onClose(); // Close the modal
    };

    const handleClose = () => {
      setNumber(1);
      onClose();
    }

    if (!isOpen) {
        return null;
    }

  return (
    <Modal data-testid={"buy-sell-cow-modal"} show={isOpen} onHide={handleClose}>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
        <Form.Group data-testid={"buy-sell-cow-modal-closeGroup"} style={{display: 'flex', justifyContent: 'right'}}>
            <Button data-testid={"buy-sell-cow-modal-close"} style={{color: '#000', borderColor: '#fff', backgroundColor: '#fff'}} type="button" className="close" aria-label="Close" onClick={handleClose}>
                <span aria-hidden="true">&times;</span>
            </Button>
        </Form.Group>
        <Form.Group>
            <Form.Label>Please specify the number of cows you'd like to {message} below.</Form.Label>
        </Form.Group>
          <Form.Group>
            <Form.Control
              data-testid={"buy-sell-cow-modal-input"}
              style={{width: '20%'}} 
              type="number" 
              value={number} 
              onChange={handleInputChange} 
              min="1" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer data-testid={"buy-sell-cow-modal-footer"} style={{borderTop: '0px'}}>
        <Button data-testid={"buy-sell-cow-modal-cancel"} variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button data-testid={"buy-sell-cow-modal-submit"} variant="primary" onClick={handleSubmit}>{message}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ManageCowsModal;
 