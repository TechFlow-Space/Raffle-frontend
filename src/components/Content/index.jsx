import React, { useState } from 'react';

import Jackpot from './Jackpot';
import DrawHistory from './DrawHistory';
import BuyTicketModal from './BuyTicketModal';

export default function ({ buyTickets, loading, lotteryHistory, showBuyModal, setShowBuyModal }) {
  return(
    <>
      <Jackpot showBuyModal={setShowBuyModal} loading={loading} />
      <DrawHistory history={lotteryHistory} />

      <BuyTicketModal
        buyTickets={buyTickets}
        show={showBuyModal}
        onHide={() => setShowBuyModal(false)}
        loading={loading}
      />
    </>
  );
}