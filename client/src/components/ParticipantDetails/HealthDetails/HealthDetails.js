import React from 'react';
import './HealthDetails.css';

const HealthDetails = ({ details, isEditting, handleChange }) => {
  let disabled = !isEditting ? 'disabled' : '';
  return (
    <section id="health-details">
      <div className="form-section">
        <div className="description">
          <h3>Health details</h3>
        </div>
        <div className="fields">
          <div className="field allergies">
            <label htmlFor="allergies">Allergies: </label>
            <input
              className={disabled}
              type="text"
              name="allergies"
              value={details.allergies}
              onChange={handleChange}
              readOnly={!isEditting}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthDetails;
