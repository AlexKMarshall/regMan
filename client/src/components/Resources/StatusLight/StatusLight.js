import React, { useState, useEffect } from 'react';
import './StatusLight.css';

// renders a rounded div with a class matching the background color.
// a switch statement renders the right class for each record status.

const StatusLight = ({ status }) => {
  const [lightColor, setLightColor] = useState('transparent');

  useEffect(() => {
    switch (status) {
      case 'New':
        setLightColor('blue');
        break;
      case 'Paid':
      case 'downpayment':
        setLightColor('orange');
        break;
      case 'Accepted':
        setLightColor('dark-blue');
        break;
      case 'Complete':
      case 'payment complete':
        setLightColor('green');
        break;
      case 'Cancelled':
      case 'pending':
        setLightColor('red');
        break;
      case 'Waitlist':
        setLightColor('purple');
        break;
      default:
        setLightColor('transparent');
        break;
    }
  }, [status]);

  return (
    <div className="status-light-container">
      <div className={`status-light ${lightColor}`}></div>
    </div>
  );
};

export default StatusLight;
