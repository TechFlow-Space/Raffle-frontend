export const updateWallet = (address, balance) => {
  return ({
    type: 'UPDATE_WALLET',
    payload: {
      address,
      balance
    }
  });
}

export const updateCurrentLottery = (ticketCount, ticketPrice, totalPrize, drawNum) => ({
  type: 'UPDATE_CURRENT_LOTTERY',
  payload: {
    ticketCount,
    ticketPrice,
    totalPrize,
    drawNum
  }
})