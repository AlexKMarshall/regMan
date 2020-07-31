import React, { useEffect } from 'react';
import { EditButtons } from '@/components';
import './DetailsFormHealth.css';

const DetailsFormHealth = ({ details, isEditting, handleChange, setDisplayEdit }) => {

  useEffect(() => {
    setDisplayEdit(true)
  }, [])

  let disabled = !isEditting ? 'disabled' : '';
  return (
    <section id="health-details">
      <div className="form-section">
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
}

export default DetailsFormHealth;
