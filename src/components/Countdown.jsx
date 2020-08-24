import React from 'react';
import Countdown from 'react-countdown-now';

//takes input in microseconds
export default function ({date}) {
  date = Math.round(parseInt(date) / 1000);
  const countdownRenderer = ({ hours, minutes, seconds }) => {
    return (
      <span className="countdown-timer">
        {hours}h {minutes}m {seconds}s
      </span>
    );
  };
  return <Countdown date={date} renderer={countdownRenderer} />
}