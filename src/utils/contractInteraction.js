import { abi } from '../assets/contract/abi';
import { address, hmy, addressOne } from './harmony';
import { hexToNumber } from '@harmony-js/utils';

export const contractCallHelper = async (methodName, paramsList) => {
  console.log("ContractCallHelper CALLED");
  const options1 = { gasPrice: '0x3B9ACA00' }; // gas price in hex corresponds to 1 Gwei or 1000000000
  let options2 = { gasPrice: 1000000000, gasLimit: 21000 };

  const contract = hmy.contracts.createContract(abi, address);
  const gas = await contract.methods[methodName](...paramsList).estimateGas(options1);
  options2 = {...options2, gasLimit: hexToNumber(gas)};

  const result = await contract.methods[methodName](...paramsList).call(options2);
  console.log(methodName);
  console.log(result);
  return result;
  // const result = await contract.methods.fn(...paramsList).estimateGas(options1).then(gas => {
  //   options2 = {...options2, gasLimit: hexToNumber(gas)};
  //   contract.methods.ticketCount().call(options2).then(count => {
  //     console.log('counter value: ' + count);
  //   });
  // });
  // contractInstance.methods.lotteryInfo(0).estimateGas(options1).then(gas => {
  //   options2 = {...options2, gasLimit: hexToNumber(gas)};
  //   contractInstance.methods.lotteryInfo(0).call(options2).then(count => {
  //     console.log('counter value: ' + count);
  //   });
  // });
}



export const contractSendTxHelper = async (contractInstance, methodName, value, paramsList) => {
  // const valueInWei = await new hmy.utils.Unit(value.toFixed()).asOne().toWei();
  // console.log(`SENDING THIS MUCH IN WEI ${valueInWei}`);
  try{
    console.log("SEND TX");
    const txnObj = {
      gasLimit: '1000001',
      gasPrice: new hmy.utils.Unit('10').asGwei().toWei(),
      value: new hmy.utils.Unit(value.toFixed()).asWei().toWei(),
      to: addressOne,
    };
    const result = await contractInstance.methods[methodName](...paramsList).send(txnObj);
    console.log(result);
    return { status: true, result};
  } catch(err) {
    console.log(err);
    return {status: false, result:JSON.stringify(err)};
  }
}