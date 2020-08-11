import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery } from 'react-query';
import ApiClient from '@app/services/ApiClient';
import moment from 'moment';
import { Navbar } from '@app/components';
import './Form.css';
import Loading from '../Resources/Loading';
import { Formik, Form, useField } from 'formik';

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

function RegistrationPage() {
  const [redirect, setRedirect] = useState(false);
  const { isLoading, data: instruments } = useQuery(
    'instruments',
    ApiClient.getInstruments
  );

  function onFormSubmit(values) {
    ApiClient.postNewAttendant(values).then(() => setRedirect(true));
  }

  if (isLoading) return <Loading />;
  if (redirect) return <Redirect to="/confirmation" />;

  return (
    <>
      <Navbar />
      <div className="main-page">
        <div className="form-container">
          <div className="black-bg"></div>
          <div className="front-picture"></div>
          <div className="form">
            <h1>Welcome!</h1>
            <p>We're pleased to have you in our summercamp!</p>
            <p>Please, fill in the form to begin the registration</p>
            <RegistrationForm
              instruments={instruments}
              onFormSubmit={onFormSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function RegistrationForm({ instruments, onFormSubmit }) {
  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        street: '',
        city: '',
        country: '',
        instrument: '',
        allergies: '',
        acceptedTerms: false,
      }}
      onSubmit={(values) => {
        onFormSubmit(values);
      }}
    >
      <Form>
        <div className="form-section">
          <div className="description">
            <h3>Personal details</h3>
            <p>Let us know your contact information</p>
          </div>
          <div className="fields">
            <div className="field">
              <TextInput
                id="firstName"
                name="firstName"
                type="text"
                label="Name:"
                className="form-input"
              />
            </div>
            <div className="field">
              <TextInput
                id="lastName"
                name="lastName"
                type="text"
                label="Surname:"
                className="form-input"
              />
            </div>
            <div className="field">
              <TextInput
                id="email"
                name="email"
                type="email"
                label="Email:"
                className="form-input"
              />
            </div>
            <div className="field">
              <TextInput
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                label="Date of birth:"
                className="form-input"
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
              <TextInput
                id="street"
                name="street"
                type="text"
                label="Street:"
              />
            </div>
            <div className="field">
              <TextInput id="city" name="city" type="text" label="City:" />
            </div>
            <div className="field">
              <TextInput
                id="country"
                name="country"
                type="text"
                label="Country:"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="description">
            <h3>Group preferences</h3>
            <p>Which instrument would you like to join?</p>
          </div>
          <div className="fields">
            <div className="field">
              <SelectInput
                id="instrument"
                name="instrument"
                label="Instrument:"
              >
                {instruments.map(({ id, name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="description">
            <h3>Medical Information</h3>
            <p>
              Let us know about any medical information that might be relevant
              during the camp
            </p>
          </div>

          <div className="fields">
            <div className="field">
              <TextInput
                id="allergies"
                name="allergies"
                type="text"
                label="Allergies:"
                className="form-input"
              />
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="description">
            <h3>Terms of Service</h3>
            <p>
              Please accept the terms of service and click send to submit your
              registration
            </p>
          </div>

          <div className="fields">
            <div className="field">
              <CheckboxInput
                id="acceptedTerms"
                name="acceptedTerms"
                className="form-checkbox"
              >
                I accept the terms of service.
              </CheckboxInput>
            </div>
          </div>
        </div>
        <div className="form-btns">
          <button type="submit">Send my registration</button>
        </div>
      </Form>
    </Formik>
  );
}

function TextInput({ label, ...props }) {
  const [field] = useField(props);

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input {...field} {...props} />
    </>
  );
}

function SelectInput({ label, ...props }) {
  const [field] = useField(props);

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
    </>
  );
}

function CheckboxInput({ children, ...props }) {
  const [field] = useField({ ...props, type: 'checkbox' });

  return (
    <>
      <label>
        <input type="checkbox" {...field} {...props} />
        {children}
      </label>
    </>
  );
}

// Pretty long form for registration.
const OldForm = () => {
  const [registration, setRegistration] = useState(newRegistration);
  // when set to true, will render the confirmation page.
  const [redirectToConfirmation, setRedirect] = useState(false);

  const { isLoading, error, data: instruments } = useQuery(
    'instruments',
    ApiClient.getInstruments
  );

  useEffect(() => {
    if (instruments) {
      setRegistration((registration) => ({
        ...registration,
        instrument: instruments[0].id,
      }));
    }
  }, [instruments]);

  function submitHandler(e) {
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
  function handleChange({ target }) {
    const value = target.name === 'acceptsTos' ? target.checked : target.value;
    setRegistration((oldRegistration) => ({
      ...oldRegistration,
      [target.name]: value,
    }));
  }

  function clearForm() {
    setRegistration(newRegistration);
  }

  if (isLoading) return <Loading />;
  if (error) return `Error ${error}`;

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
                      id="name"
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
                      id="lastname"
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
                      id="email"
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
                      id="birthdate"
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
                      id="street"
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
                      id="city"
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
                      id="country"
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
                      id="instrumentId"
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
                      id="allergies"
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
                      id="acceptsTos"
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
                <button type="submit">Send my registration</button>
                <button className="clear-form" onClick={clearForm}>
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

export default RegistrationPage;
