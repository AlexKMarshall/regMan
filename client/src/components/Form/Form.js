import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useInstruments } from '@app/services/instruments';
import { useCreateParticipant } from '@app/services/participants';
import moment from 'moment';
import { Navbar } from '@app/components';
import './Form.css';
import Loading from '../Resources/Loading';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

function RegistrationPage() {
  const [redirect, setRedirect] = useState(false);
  const { isLoading, instruments } = useInstruments();
  const [createParticipant] = useCreateParticipant();

  function transformRegistrationData(formData) {
    // TODO this logic for being under 18 really shouldn't live here
    // The server should calculate it
    const courseStart = moment(process.env.REACT_APP_COURSE_START);
    const dateOfBirth = moment(formData.dateOfBirth);
    const is_underage = courseStart.diff(dateOfBirth, 'years') < 18;

    const {
      firstName: first_name,
      lastName: last_name,
      dateOfBirth: date_of_birth,
      email,
      street,
      city,
      country,
      instrument: instrumentId,
      allergies,
      acceptedTerms: accepts_tos,
    } = formData;

    return {
      first_name,
      last_name,
      date_of_birth,
      email,
      street,
      city,
      country,
      instrumentId,
      allergies,
      accepts_tos,
      is_underage,
    };
  }

  async function onFormSubmit(values) {
    const newRegistration = transformRegistrationData(values);
    try {
      await createParticipant({ participant: newRegistration });
      setRedirect(true);
    } catch (error) {
      console.error(error);
    }
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
              onSubmit={onFormSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function RegistrationForm({ instruments, onSubmit }) {
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
      validationSchema={Yup.object({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        dateOfBirth: Yup.date().required('Required'),
        street: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        country: Yup.string().required('Required'),
        instrument: Yup.string(),
        allergies: Yup.string(),
        acceptedTerms: Yup.boolean()
          .required('Required')
          .oneOf([true], 'You must accept the terms and conditions.'),
      })}
      onSubmit={async (values) => {
        await onSubmit(values);
      }}
    >
      {({ isValid, isSubmitting }) => (
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
                  <option key="empty" value="empty"></option>
                  {instruments.map(({ id, name }) => (
                    <option key={id} value={id}>
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
            {/* TODO - need to style disabled state of button, it looks the same */}
            <button type="submit" disabled={!isValid || isSubmitting}>
              Send my registration
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function TextInput({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="field-error">{meta.error}</div>
      ) : null}
    </>
  );
}

function SelectInput({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="field-error">{meta.error}</div>
      ) : null}
    </>
  );
}

function CheckboxInput({ children, ...props }) {
  const [field, meta] = useField({ ...props, type: 'checkbox' });

  return (
    <>
      <label>
        <input type="checkbox" {...field} {...props} />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="field-error">{meta.error}</div>
      ) : null}
    </>
  );
}

export default RegistrationPage;
