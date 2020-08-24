import { ChainID, ChainType } from "@harmony-js/utils";
import { fromBech32 } from "@harmony-js/crypto";
import { Harmony, HarmonyExtension } from "@harmony-js/core";
import { abi } from "../assets/contract/abi";
import createKeccakHash from 'keccak';
import Abi from 'web3-eth-abi';

const addressOne = "one1v5chexafzjum02xdmsmrmjnvh0ek2rnju424g8";
const address = fromBech32(addressOne);

const url = "https://api.s0.b.hmny.io";
const hmy = new Harmony(url, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyLocal,
});

export const waitForInjected = () => (
  new Promise((resolve) => {
    const check = () => {
      if(!window.harmony) setTimeout(check, 250);
      else resolve(window.harmony);
    }
    check();
  })
)

let harmonyEx, extRaffle;
export const initExtension = async () => {
  harmonyEx = await new HarmonyExtension(window.harmony);
  extRaffle = harmonyEx.contracts.createContract(abi, address);
  return extRaffle;
}


// -----------EVENTS PROCESSING SECTION-----------


const decodeParameters = (names, types, data) => {
  const ret = {};

  console.log("PARAM TYPE", types);
  console.log("PARAM DATA", data);

  if (names.length && names.length === types.length) {
    const result = Abi.decodeParameters(types, data);

    for (let i = 0; types.length > i; i += 1) {
      if (undefined !== result[i]) {
        ret[names[i]] = result[i];
      }
    }
  }
  return ret
}

const processResult = async (txHash) => {
  try {
    const { result } = await hmy.blockchain.getTransactionReceipt({txnHash:txHash});
    console.log(result);

    let res;
    result.logs.forEach(event => {
      // if(event.topics[0] == '0x'+createKeccakHash('keccak256').update('RandomNo(uint256)').digest('hex')){
      //   let valid = event.data;
      //   console.log("Generated Random Number:"+ +valid); 
      // }
      if(event.topics[0] == '0x'+createKeccakHash('keccak256').update('YourTicket(uint256)').digest('hex')){
        res = decodeParameters(['Ticket No.'], ['uint256'], event.data);
      }
      if(event.topics[0] == '0x'+createKeccakHash('keccak256').update('YourTicket(uint256,uint256)').digest('hex')){
        res = decodeParameters(['Starting Ticket No.', 'Ending Ticket No.'], ['uint256', 'uint256'], event.data.slice(2));
      } 
    });
    return res;
  } catch(err) {
    throw err;
  }
}

export { hmy, url, processResult, addressOne, address };