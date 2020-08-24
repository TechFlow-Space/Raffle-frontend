import React, { useMemo } from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment-timezone';
import BigNumber from 'bignumber.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toBech32 } from "@harmony-js/crypto";

import { formatAddress } from '../../utils/formatting';

const DrawHistoryTable = ({historyData}) => {

  const copyToClipboard = (data) => {
    navigator.clipboard.writeText(toBech32(data));
    toast.info("Address copied.");
  };

  return(
    <Table responsive className='table-hover'>
      <thead>
        <tr>
          <th className='responsive-text'>Date</th>
          <th className='responsive-text'>Jackpot Amount</th>
          <th className='responsive-text'>First</th>
          <th className='responsive-text'>Second</th>
          <th className='responsive-text'>Third</th>
        </tr>
      </thead>
      <tbody>
        {historyData.map((data, id) => (
          <tr key={id}>
            <td className='responsive-text'>{moment(new Date().setDate(new Date().getDate()-id-1)).tz('Africa/Bissau').format('YYYY/MM/DD')}</td>
            <td className='responsive-text'>{new BigNumber(data.participants).multipliedBy(data.TicketPrice).toFixed()}</td>
            <td className='responsive-text hover-copy' onClick={()=>copyToClipboard(data.First)}>{formatAddress(toBech32(data.First))}</td>
            <td className='responsive-text hover-copy' onClick={()=>copyToClipboard(data.Second)}>{formatAddress(toBech32(data.Second))}</td>
            <td className='responsive-text hover-copy' onClick={()=>copyToClipboard(data.Third)}>{formatAddress(toBech32(data.Third))}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

const DrawHistory = ({history}) => {
  return(
    <div className='draw-history center flex-col'>
      <h2 style={{fontWeight: 'bold'}}>Last Drawings</h2>
      <div className='draw-history-table-wrapper'>
        <DrawHistoryTable historyData={history} />
      </div>
    </div>
  );
}

export default DrawHistory;