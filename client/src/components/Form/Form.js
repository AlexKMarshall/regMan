import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import ApiClient from '@app/services/ApiClient';
import moment from 'moment';
import { Navbar } from '@app/components';
import './Form.css';

// default value for the form
const newRegistration = {
  name: '',
  lastname: '',
  email: '',
  birthdate: '',
  street: '',
  city: '',
  country: '',
  allergies: '',
  acceptsTos: false,
};

// Pretty long form for registration.
const Form = () => {
  const [registration, setRegistration] = useState(newRegistration);
  // when set to true, will render the confirmation page.
  const [redirectToConfirmation, setRedirect] = useState(false);
  const [instruments, setInstruments] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    ApiClient.getInstruments().then((instruments) => {
      if (instruments.error) setError(true);
      else setInstruments(instruments);
    });
  }, []);

  useEffect(() => {
    const fiddle = instruments.filter(
      (instrument) => instrument.name === 'Fiddle'
    )[0];
    fiddle &&
      setRegistration((registration) => ({
        ...registration,
        instrumentId: fiddle.id,
      }));
  }, [instruments]);

  function submitHandler (e) {
    e.preventDefault();
    const courseStart = moment(process.env.REACT_APP_COURSE_START);
    const dateBirth = moment(registration.birthdate);
    // checks if the attendant will be 18 when the camp starts. If not, sets a flag for underage.
    // this is used in the backend to apply a discount to the attendant.
    courseStart.diff(dateBirth, 'years') < 18 &&
      (registration.is_underage = true);
    ApiClient.postNewAttendant(registration);
    setRedirect(true);
  }

  // handles change for all the fields. acceptsTos is a checkbox, so it needs a different target
  function handleChange ({ target }) {
    const value = target.name === 'acceptsTos' ? target.checked : target.value;
    setRegistration((oldRegistration) => ({
      ...oldRegistration,
      [target.name]: value,
    }));
  }

  function clearForm () {
    setRegistration(newRegistration);
  }

  // handles errirs with the API calls or redirects the user to the confirmation page.
  if (error) return <Redirect to={'/error500'} />;
  if (redirectToConfirmation) return <Redirect to="/confirmation" />;

  return (
    <div>
      <Navbar />
      <div className="main-page">
        <div className="form-container">
          <div className="black-bg"></div>
          <div className="front-picture"></div>
          <div className="form">
            <h1>Welcome!</h1>
            <p>We're pleased to have you in our summercamp!</p>
            <p>Please, fill in the form to begin the registration</p>

            <form onSubmit={submitHandler}>
              <div className="form-section">
                <div className="description">
                  <h3>Personal details</h3>
                  <p>Let us know your contact information</p>
                </div>
                <div className="fields">
                  <div className="field">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      name="name"
                      aria-label='name'
                      className="form-input"
                      value={registration.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="lastname">Surname:</label>
                    <input
                      type="text"
                      name="lastname"
                      aria-label='lastname'
                      className="form-input"
                      value={registration.lastname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="text"
                      name="email"
                      aria-label='email'
                      className="form-input"
                      value={registration.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="birthdate">Date of birth:</label>
                    <input
                      type="date"
                      min="1900-01-01"
                      max="2020-12-31"
                      name="birthdate"
                      aria-label='birthdate'
                      className="form-input"
                      value={registration.birthdate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <div className="description">
                  <h3>Address</h3>
                </div>
                <div className="fields">
                  <div className="field">
                    <label htmlFor="street">Street:</label>
                    <input
                      type="text"
                      name="street"
                      aria-label='street'
                      className="form-input"
                      value={registration.street}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="city">City:</label>
                    <input
                      type="text"
                      name="city"
                      aria-label='city'
                      className="form-input"
                      value={registration.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="country">Country:</label>
                    <input
                      type="text"
                      name="country"
                      aria-label='country'
                      className="form-input"
                      value={registration.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <div className="description">
                  <h3>Group prefferences</h3>
                  <p>Which instrument would you like to join?</p>
                </div>
                <div className="fields">
                  <div className="field">
                    <label htmlFor="instrumentId">Instrument:</label>
                    <select
                      name="instrumentId"
                      aria-label='instrumentId'
                      data-testid="select"
                      value={registration.instrumentId}
                      onChange={handleChange}
                      required
                    >
                      {instruments.map((instrument) => (
                        <option
                          data-testid="select-option"
                          key={'instrument' + instrument.id}
                          value={instrument.id}
                        >
                          {instrument.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-section">
                <div className="description">
                  <h3>Medical Information</h3>
                  <p>
                    Let us know about any medical information that might be
                    rellevant during the camp
                  </p>
                </div>
                <div className="fields">
                  <div className="field">
                    <label htmlFor="allergies">Allergies:</label>
                    <input
                      type="text"
                      name="allergies"
                      aria-label='allergies'
                      className="form-input"
                      value={registration.allergies}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <div className="description">
                  <h3>Terms of Service</h3>
                  <p>
                    Please accept the terms of service and click send to submit
                    your registration
                  </p>
                </div>
                <div className="fields">
                  <div className="field accept-tos">
                    <input
                      type="checkbox"
                      name="acceptsTos"
                      aria-label='acceptTos'
                      className="form-checkbox"
                      checked={registration.acceptsTos}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="acceptsTos">
                      {' '}
                      I accept the terms of service.
                   </label>
                  </div>
                </div>
              </div>
              <div className="form-btns">
                <button type="submit" aria-label='submit'>Send my registration</button>
                <button className="clear-form" onClick={clearForm} aria-label='clearForm'>
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="white-space" />
      </div>
    </div>
  );
};

export default Form;
