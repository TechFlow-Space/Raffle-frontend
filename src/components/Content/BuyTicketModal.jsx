import React, { useState} from 'react';
import { Modal, Row, Col, Spinner, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { toast } from 'react-toastify';

function BuyTicketModal({show, onHide, ticketPrice, buyTickets, loading}) {

  const [noOfTickets, setNoOfTickets] = useState(0);

  const submitForm = (e)=> {
    e.preventDefault();
    if(noOfTickets <= 0) {
      toast.error("Number of tickets should be non-zero");
      return;
    }
    if(noOfTickets > 20) {
      toast.error("Can buy max 20 tickets at a time");
      return;
    }
    buyTickets(noOfTickets);
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="sm"
      className='buy-ticket-modal'
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <p className='modal-head'>Enter Number of Tickets To Buy</p>
        <Row>
          <Col className='mr-4 ml-4 pr-4 pl-4 mt-2'>
            <form onSubmit={submitForm}>
              <div className='form-group'>
                <input 
                  className='form-control' 
                  type='text' 
                  pattern='[0-9]*' 
                  title="Requires integer value"
                  value={noOfTickets}
                  onChange={(e)=>setNoOfTickets(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <Button
                  type='submit' 
                  variant='info'
                  className='btn blue-btn form-control'
                  disabled={loading}
                >
                  {!loading ? 'Buy Now' : <Spinner animation="border" />}
                </Button>
              </div>
            </form>
            <p className='modal-foot'>
              Each ticket is only {new BigNumber(ticketPrice).dividedBy(Math.pow(10,18)).toFixed()} ONE.
            </p>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

const mapStateToProps = (store) => ({
  ticketPrice: store.lotteryReducer.ticketPrice,
});

export default connect(mapStateToProps)(BuyTicketModal);