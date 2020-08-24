import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment-timezone';
import BigNumber from 'bignumber.js';

import { numberWithCommas } from '../../utils/formatting';
import CountDown from '../Countdown';
import './styles.scss';

const lotteryAnnouncementTime = () => {
  const midnight = new Date();
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);
  let midnightMilliseconds;
  if (midnight.getTimezoneOffset() <= 0) {
    midnightMilliseconds =
      midnight.getTime() - midnight.getTimezoneOffset() * 60 * 1000;
  } else {
    midnightMilliseconds =
      midnight.getTime() +
      (24 * 60 * 60 * 1000 - midnight.getTimezoneOffset() * 60000);
  }
  let midnightGmt = moment(midnightMilliseconds)
    .tz('Africa/Bissau')
    .format('x');
  let gmtTime = moment(Date.now())
    .tz('Africa/Bissau')
    .format('x');
  let timeDifference = parseInt(midnightGmt) - parseInt(gmtTime);
  return {
    timeDifference,
    midnightGmt: parseInt(midnightGmt),
    gmtTime: parseInt(gmtTime),
  };
};

const Jackpot = React.memo(({drawNo, jackpotAmt, timer, ticketPrice, showBuyModal, walletAddress, loading}) => {

  const handleBuyTickets = () => {
    if(walletAddress) 
      showBuyModal(true);
    else
      toast.error("Please login first.")
  }

  return(
    <div className='jackpot-container center flex-row'>
      <div className='jackpot-inner'>
        <div>
          <div className='jackpot-inner-child center flex-row draw-num'>Draw No : {drawNo}</div>
        </div>
        <div className='center flex-col jackpot-main'>
            <span style={{fontSize: '40px'}} className='bold-font'>JACKPOT</span>
            <div className='center'>
              <span style={{fontSize:'25px'}}>{numberWithCommas(new BigNumber(jackpotAmt).dividedBy(Math.pow(10,18)).toFixed())} ONE</span>
            </div>
        </div>
        <div style={{height:'90px'}}></div>
        <div className='jackpot-inner-child center timer'>
          <CountDown date={(Date.now() + lotteryAnnouncementTime().timeDifference) * 1000} />
        </div>

        <div className='center jackpot-inner-child'>
          <Button disabled={loading} onClick={handleBuyTickets} variant='info' style={{width: '190px', height: '45px'}} className='blue-btn'>
            { !loading ? 
              <span className='bold-font'>Buy Ticket</span>
              :
              <Spinner animation="border" />
            }
          </Button>
        </div>
        
        <div className='center jackpot-foot'>
          {new BigNumber(ticketPrice).dividedBy(Math.pow(10,18)).toFixed()} ONE Per Ticket
        </div>
      </div>
    </div>
  );
})

const mapStateToProps = (store) => ({
  ticketCount: store.lotteryReducer.ticketCount,
  jackpotAmt: store.lotteryReducer.totalPrize,
  ticketPrice: store.lotteryReducer.ticketPrice,
  drawNo: store.lotteryReducer.drawNum,
  walletAddress: store.lotteryReducer.walletAddress,
});

export default connect(mapStateToProps)(Jackpot);