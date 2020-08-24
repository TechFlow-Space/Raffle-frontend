import React, { useState, useCallback, useEffect } from 'react';
import { HarmonyExtension } from '@harmony-js/core';
import { connect } from 'react-redux';
import SweetAlert from 'sweetalert2-react';
import BigNumber from 'bignumber.js';
import { toast, ToastContainer } from 'react-toastify';

import { updateWallet, updateCurrentLottery } from '../redux/actions';
import { addressOne, processResult, hmy, url, initExtension, waitForInjected } from '../utils/harmony';
import { contractCallHelper, contractSendTxHelper } from '../utils/contractInteraction';
import Header from '../components/Header';
import Content from '../components/Content';

let contractInstance;

function Homepage(props) {
  const [error, setError] = useState('');
  const [showGetExtensionMsg, getExtensionMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [lotteryHistory, setLotteryHistory] = useState([]);
  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    initContract();
    getRaffleInfo();
    //get user info from previous login
    checkUserInfo();
  }, []);

  useEffect(()=> {
    getLastSevenResults();
  }, [props.drawNum])

  const checkUserInfo = async () => {
    let storedAddress = localStorage.getItem('oneAddress');
    if(storedAddress) {
      console.log(JSON.stringify(storedAddress));
      await waitForInjected();
      let harmonyEx = await new HarmonyExtension(window.harmony);
      harmonyEx.provider.url = url;
      const myWallet = await harmonyEx.login();
      const balance = await hmy.blockchain.getBalance({
        address: storedAddress,
      });
      props.dispatch(updateWallet(storedAddress, new hmy.utils.Unit(balance.result).asWei().toOne()));
    }
  }

  const initContract = async () => {
    await waitForInjected();
    contractInstance = await initExtension();
    console.log(contractInstance);
  }

  const getRaffleInfo = async () => {
    try{
      const ticketCount = await contractCallHelper('ticketCount', []);
      const totalPrize = await contractCallHelper('jackpotAmountCount', []);
      const ticketPrice = await contractCallHelper('ticketPriceCount', []);
      const drawNum = await contractCallHelper('lotteryNumberCount', []);
      const lotteryInfor = await contractCallHelper('lotteryInfo', [0]);
      props.dispatch(updateCurrentLottery(ticketCount.toNumber(), ticketPrice, totalPrize, drawNum.toNumber()));
      if(props.walletAddress){
        const balance = await hmy.blockchain.getBalance({
          address: props.walletAddress,
        });
        props.dispatch(updateWallet(props.walletAddress, new hmy.utils.Unit(balance.result).asWei().toOne()));
      }
    } catch (err) {
      setError(err);
      console.log(err);
    }
  }

  const harmonyInit = async () => {
    try {
      let harmonyEx = await new HarmonyExtension(window.harmony);
      harmonyEx.provider.url = url;

      const myWallet = await harmonyEx.login();
      localStorage.setItem('oneAddress', myWallet.address);
      const balance = await hmy.blockchain.getBalance({
        address: myWallet.address,
      });
      props.dispatch(updateWallet(myWallet.address, new hmy.utils.Unit(balance.result).asWei().toOne()));
    } catch(err) {
      setError("Make sure you have Math Wallet extension, and is enabled");
      getExtensionMsg("Enable Math Wallet or Get it <a target='_blank' href='https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc?hl=en'>here</a>")
      console.error("Make sure you have math wallet extension, and is enabled");
    }
  }

  const logUserOut = () => {
    localStorage.removeItem('oneAddress');
    props.dispatch(updateWallet('', 0));
  }

  const showSuccessAlert = (res, txHash, ticketQty) => {
    const ticketNumMsg = `${Object.keys(res).map(ticket => ticket+"- " + res[ticket]).join('\t')}`;
    setSuccessMsg(`Bought <span class='text-bolder'>${ticketQty}</span> tickets. <br/> ${ticketNumMsg}<br/><br/> <span class='text-bolder'>Tx Hash:</span> ${txHash}`);
  }
  
  const buyTickets = async (ticketQty) => {
    setLoading(true);
    ticketQty = new BigNumber(ticketQty);
    const perTicketPrice = new BigNumber(props.ticketPrice);
    const totalCost = ticketQty.multipliedBy(perTicketPrice);
    try{
      const txResult = await contractSendTxHelper(contractInstance, 'buyTicket', totalCost, []);
      if(txResult.status && txResult.result.status !== 'rejected') {
        const res = await processResult(txResult.result.transaction.receipt.transactionHash);
        showSuccessAlert(res, txResult.result.transaction.receipt.transactionHash, ticketQty);
        setShowBuyModal(false);
      } else {
        toast.error("Could not process the transaction");
      }
    } catch (err) {
      toast.error("Transaction failed");
      toast.error(JSON.stringify(err));
      console.log(err);
    } finally {
      getRaffleInfo().then(() => setLoading(false));
    }
  }

  const getLastSevenResults = async () => {
    let counter = props.drawNum - 1;
    let last7Lotteries = [];
    while(counter >= props.drawNum-7 && counter > 0) {
      const lotteryInfo = await contractCallHelper('lotteryInfo', [counter]);
      last7Lotteries.push(lotteryInfo);
      counter--;
    }
    setLotteryHistory(JSON.parse(JSON.stringify(last7Lotteries)));
  }

  return(
    <>
      <Header logUserIn={harmonyInit} logout={logUserOut} />
      <Content buyTickets={buyTickets} loading={loading} lotteryHistory={lotteryHistory} showBuyModal={showBuyModal} setShowBuyModal={setShowBuyModal} />
      <ToastContainer />
      <SweetAlert
        show={!!showGetExtensionMsg}
        title="Wallet Required"
        html={showGetExtensionMsg}
        onConfirm={() => getExtensionMsg('')}
      />
      <SweetAlert
        type='success'
        show={!!successMsg && !loading}
        html={successMsg}
        onConfirm={() => setSuccessMsg('')}
        icon='success'
      />
      
    </>
  );
}

const mapStateToProps = (store) => ({
  ticketCount: store.lotteryReducer.ticketCount,
  totalPrize: store.lotteryReducer.totalPrize,
  ticketPrice: store.lotteryReducer.ticketPrice,
  walletAddress: store.lotteryReducer.walletAddress,
  walletBalance: store.lotteryReducer.walletBalance,
  drawNum: store.lotteryReducer.drawNum
});

export default connect(mapStateToProps)(Homepage);