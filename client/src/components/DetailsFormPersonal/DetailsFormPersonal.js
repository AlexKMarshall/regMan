import React from 'react';
import moment from 'moment';
import {EditButtons} from '@/components'

const DetailsFormPersonal = ({details, instruments, isEditting, handleChange, buttonFunctionality}) => {
  let disabled = !isEditting ? 'disabled' : '';

  return (
    <section id="personal-details">
      <EditButtons isEditting={isEditting} buttonFunctionality={buttonFunctionality} />
      <div className="form-fields">
        <div className="field instrument">
          <label htmlFor="instrumentId">Registered for: </label>
            <select
              className={disabled}
              name="instrumentId"
              value={details.instrumentId}
              onChange={handleChange}
              disabled={!isEditting}
            >
              {instruments.map(instrument => <option key={'instrument'+instrument.id} value={instrument.id}>{instrument.name}</option>)}
            </select>
        </div>
      <div className="field registration-status">
          <label htmlFor="registration_status">Registration status: </label>
          <select
            className={disabled}
            name="registration_status"
            value={details.registration_status}
            onChange={handleChange}
            disabled={!isEditting}
          >
            <option value="New">New</option>
            <option value="Accepted">Accepted</option>
            <option value="Paid">Paid</option>
            <option value="Complete">Complete</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Waitlist">Waitlist</option>
          </select>
        </div>
        <div className="field name">
          <label htmlFor="first_name">Name: </label>
          <input
            className={disabled}
            type="text"
            name="first_name"
            value={details.first_name}
            onChange={handleChange}
            readOnly={!isEditting}
          />
        </div>
        <div className="field surname">
          <label htmlFor="last_name">Surname: </label>
          <input
            className={disabled}
            type="text"
            name="last_name"
            value={details.last_name}
            onChange={handleChange}
            readOnly={!isEditting}
          />
        </div>
        <div className="field email">
          <label htmlFor="email">Email: </label>
          <input
            className={disabled}
            type="text"
            name="email"
            value={details.email}
            onChange={handleChange}
            readOnly={!isEditting}
          />
        </div>
        <div className="field date_of_birth">
          <label htmlFor="date_of_birth">Date of Birth: </label>
          <input
            className={disabled}
            type="date"
            name="date_of_birth"
            value={moment(details.date_of_birth).format('YYYY-MM-DD')}
            onChange={handleChange}
            readOnly={!isEditting}
          />
          <label htmlFor="age">
            Age at the beginning of camp: <b>{details.age} </b>
            {details.is_underage
              ? (<span role="img" aria-label="underage">🔞</span>)
              : (<span role="img" aria-label="underage">✅</span>)
            }
          </label>
        </div>
        <div className="field street">
          <label htmlFor="street">Street: </label>
          <input
            className={disabled}
            type="text"
            name="street"
            value={details.street}
            onChange={handleChange}
            readOnly={!isEditting}
          />
        </div>
        <div className="field city">
          <label htmlFor="city">City: </label>
          <input
            className={disabled}
            type="text"
            name="city"
            value={details.city}
            onChange={handleChange}
            readOnly={!isEditting}
          />
        </div>
        <div className="field country">
          <label htmlFor="country">Country: </label>
          <input
            className={disabled}
            type="text"
            name="country"
            value={details.country}
            onChange={handleChange}
            readOnly={!isEditting}
          />
        </div>

      </div>
    </section>
  );
}

export default DetailsFormPersonal;
