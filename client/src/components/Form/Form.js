import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import ApiClient from '@/services/ApiClient';
import moment from 'moment';

const newRegistration = {
  first_name: '',
  last_name: '',
  email: '',
  date_of_birth: '',
  street: '',
  city: '',
  country: '',
  allergies: '',
  accepts_tos: false,
}

const Form = () => {

  const [registration, setRegistration] = useState(newRegistration);
  const [redirectToConfirmation, setRedirect] = useState(false);
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    ApiClient.getInstruments()
      .then(instruments => setInstruments(instruments))
  }, []);

  useEffect(() => {
    const fiddle = instruments.filter(instrument => instrument.name === 'Fiddle')[0];
    fiddle && setRegistration(registration => ({...registration, instrumentId: fiddle.id}))
  }, [instruments]);

  function submitHandler (e) {
    e.preventDefault();
    const courseStart = moment(process.env.REACT_APP_COURSE_START);
    const dateBirth = moment(registration.date_of_birth);
    courseStart.diff(dateBirth, 'years') < 18 && (registration.is_underage = true);
    ApiClient.postNewAttendant(registration);
    setRedirect(true);
  }

  function handleChange ({target}) {
    const value = target.name === 'accepts_tos' ? target.checked : target.value;
    setRegistration(oldRegistration => ({...oldRegistration, [target.name]: value}))
  }

  function clearForm () {
    setRegistration(newRegistration);
  }

  if (redirectToConfirmation) return (<Redirect to="/confirmation"/>)

  return (
    <div className="form">
      <h1>Welcome!</h1>
      <p>Please fill in the form to begin your registration process.</p>

      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="first_name">Name: </label>
          <input
            type="text"
            name="first_name"
            className="form-input"
            value={registration.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="last_name">Surname: </label>
          <input
            type="text"
            name="last_name"
            className="form-input"
            value={registration.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            name="email"
            className="form-input"
            value={registration.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="date_of_birth">Date of birth: </label>
          <input
            type="date"
            min="1900-01-01"
            max="2020-12-31"
            name="date_of_birth"
            className="form-input"
            value={registration.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="street">Street: </label>
          <input
            type="text"
            name="street"
            className="form-input"
            value={registration.street}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="city">City: </label>
          <input
            type="text"
            name="city"
            className="form-input"
            value={registration.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="country">Country: </label>
          <input
            type="text"
            name="country"
            className="form-input"
            value={registration.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="instrumentId">Instrument: </label>
          <select
            name="instrumentId"
            value={registration.instrumentId}
            onChange={handleChange}
          >
            {instruments.map(instrument => <option key={'instrument'+instrument.id} value={instrument.id}>{instrument.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="allergies">Allergies: </label>
          <input
            type="text"
            name="allergies"
            className="form-input"
            value={registration.allergies}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="checkbox"
            name="accepts_tos"
            className="form-checkbox"
            checked={registration.accepts_tos}
            onChange={handleChange}
            required
          />
          <label htmlFor="accepts_tos"> I accept the terms of service.</label>
        </div>
        <button type="submit">Send my registration</button>
        <button className="clear-form" onClick={clearForm}>Clear Form</button>
      </form>
    </div>
  );
}

export default Form;
