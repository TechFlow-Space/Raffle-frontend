import { combineReducers } from 'redux';

const initialState = {
  ticketCount: 0,
  totalPrize: 0,
  ticketPrice: 0,
  drawNum: 0,
  walletAddress: '',
  walletBalance: 0,
};

const lotteryReducer = (state=initialState, action) => {
  console.log(action);
  const payload = action.payload;

  switch(action.type) {
    case 'UPDATE_WALLET':
      return {
        ...state,
        walletAddress: payload.address,
        walletBalance: payload.balance
      }
    case 'UPDATE_CURRENT_LOTTERY':
      return {
        ...state,
        ticketCount: payload.ticketCount,
        ticketPrice: payload.ticketPrice,
        totalPrize: payload.totalPrize,
        drawNum: payload.drawNum,
      }
    default: 
      return state;
  }
}

export const rootReducer = combineReducers({ lotteryReducer });