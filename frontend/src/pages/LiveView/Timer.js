import React, { useState, useEffect } from 'react';

const Timer = ({ startTime }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (startTime) {
      const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
      setHours(startHours);
      setMinutes(startMinutes);
      setSeconds(startSeconds);
    }

    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds === 59) {
          setMinutes(prevMinutes => {
            if (prevMinutes === 59) {
              setHours(prevHours => prevHours + 1);
              return 0;
            } else {
              return prevMinutes + 1;
            }
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
      {hours > 0 ? (
        <div>{`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</div>
      ) : (
        <div>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</div>
      )}
    </div>
  );
};

export default Timer;
