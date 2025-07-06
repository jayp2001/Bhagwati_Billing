import React, { useState, useEffect } from 'react';

const TimerMinutes = ({ startTime }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (startTime) {
      const startMinutes = startTime;
      setMinutes(startMinutes);
      setSeconds(0);
    }

    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds === 59) {
          setMinutes(prevMinutes => {
            return prevMinutes + 1;
          });
          return 0;
        } else {
          return prevSeconds + 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div>
      <div>{minutes.toString()} Min</div>
    </div>
  );
};

export default TimerMinutes;
