import React from 'react';
import { EditButtons } from '@/components'

const DetailsFormHealth = ({ details, isEditting, handleChange, buttonFunctionality }) => {
  let disabled = !isEditting ? 'disabled' : '';
  return (
    <section id="health">
      <EditButtons isEditting={isEditting} buttonFunctionality={buttonFunctionality} />
      <div className="form-fields">
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
    </section>
  );
}

export default DetailsFormHealth;
