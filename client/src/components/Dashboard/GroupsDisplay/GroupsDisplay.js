import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import ApiClient from '@app/services/ApiClient';
import { useAuth0 } from '@auth0/auth0-react';
import './GroupsDisplay.css';

function resetFormState(instruments) {
  return instruments.reduce((formState, instrument) => {
    formState.set(instrument.id, instrument);
    return formState;
  }, new Map());
}

const GroupsDisplay = ({
  participants,
  instruments,
  setInstruments,
  onUpdateInstruments,
}) => {
  console.log('render with instruments: ', instruments);

  const [availableSpacesForm, setAvailableSpacesForm] = useState(() =>
    resetFormState(instruments)
  );
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setAvailableSpacesForm(resetFormState(instruments));
  }, [instruments]);

  const handleChange = ({ target }, id) => {
    setAvailableSpacesForm((oldFormState) => {
      const oldInstrument = oldFormState.get(id);
      const max_attendants = parseInt(target.value);
      const newInstrument = { ...oldInstrument, max_attendants };
      const newFormState = new Map(oldFormState);
      newFormState.set(id, newInstrument);
      return newFormState;
    });
  };

  const submitMaxValues = (e) => {
    e.preventDefault();
    const formInstruments = [...availableSpacesForm.values()];
    getAccessTokenSilently()
      .then((token) => ApiClient.updateInstruments(formInstruments, token))
      .then((returnedInstruments) => {
        setInstruments(returnedInstruments);
        setAvailableSpacesForm(resetFormState(returnedInstruments));
      });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    const instruments = [...availableSpacesForm.values()];
    onUpdateInstruments({ instruments });
  };

  const cancelChanges = (e) => {
    e.preventDefault();
    setAvailableSpacesForm(resetFormState(instruments));
  };

  // this is a lot of fun... react-chartjs-2 is a library that makes making charts easier.
  // in doing so, it makes styling mooooooore complicated. This is why style is hardcoded into every chart.
  // All the charts accept a configuration object that regulates different properties of the display (axes, ticks, gridlines...)
  return (
    <div className="charts-container">
      <div className="chart-grid">
        <div className="chart-card">
          <div className="groups-setup">
            <form>
              <div className="fields">
                {[...availableSpacesForm.entries()].map(
                  ([id, { name, max_attendants }]) => (
                    <div key={`instr-${id}`} className="graph-field">
                      <label htmlFor={name}>{name}</label>
                      <input
                        type="number"
                        min="0"
                        name={name}
                        value={max_attendants}
                        onChange={(e) => handleChange(e, id)}
                      />
                    </div>
                  )
                )}
              </div>
              <div className="total-participants">
                Total Spots:{' '}
                {[...availableSpacesForm.values()].reduce(
                  (acc, el) => acc + el.max_attendants,
                  0
                )}
              </div>
              <div className="groups-setup-btn">
                <button onClick={onFormSubmit}>Update Group Limits</button>
                <button onClick={cancelChanges}>Cancel Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <MaxDistributionChart instruments={instruments} />
      <ParticipationDistributionChart
        instruments={instruments}
        participants={participants}
      />
      <AvailableSpotsChart
        instruments={instruments}
        participants={participants}
      />
      <UnderagePercentageChart participants={participants} />
      <AgeDistributionChart participants={participants} />
      <div className="white-space"></div>
    </div>
  );
};

function MaxDistributionChart({ instruments }) {
  const instrMaxDistributionData = useMemo(() => {
    return {
      labels: instruments.map(({ name }) => name),
      datasets: [
        {
          backgroundColor: [
            '#f28939',
            '#39998e',
            '#347dca',
            '#ff4557',
            '#57455a',
          ],
          borderWidth: 1,
          data: instruments.map(({ max_attendants }) => max_attendants),
          label: 'distribution of max attendants per instrument',
        },
      ],
    };
  }, [instruments]);

  return (
    <div className="chart-grid">
      <div className="chart-card">
        <div
          className="chart-max-instr-distribution"
          style={{ height: '300px' }}
        >
          <Doughnut
            data={instrMaxDistributionData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              title: {
                text: 'Distribution of spots per instrument',
                display: true,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ParticipationDistributionChart({ instruments, participants }) {
  const countParticipantsByInstrument = useMemo(() => {
    return instruments.map(({ name: instrumentName }) => ({
      instrumentName,
      participantsCount: participants.filter(
        ({ instrument }) => instrument.name === instrumentName
      ).length,
    }));
  }, [instruments, participants]);

  const participantsDistrByInstrData = useMemo(() => {
    return {
      labels: instruments.map(({ name }) => name),
      datasets: [
        {
          backgroundColor: [
            '#f7bd92',
            '#89cfc7',
            '#7ea4cc',
            '#ff808c',
            '#a17fa7',
          ],
          borderWidth: 1,
          data: countParticipantsByInstrument.map(
            ({ participantsCount }) => participantsCount
          ),
          label: 'registered participants',
        },
        {
          backgroundColor: [
            '#f28939',
            '#39998e',
            '#347dca',
            '#ff4557',
            '#571f61',
          ],
          borderWidth: 1,
          data: instruments.map(({ max_attendants }) => max_attendants),
          label: 'maximum attendants',
        },
      ],
    };
  }, [instruments, countParticipantsByInstrument]);

  return (
    <div className="chart-grid">
      <div className="chart-card">
        <div className="chart-ocupation-instrument" style={{ height: '300px' }}>
          <Bar
            data={participantsDistrByInstrData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              title: {
                text: 'Group ocupation vs maximum attendants',
                display: true,
              },
              legend: { display: false },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      autoSkip: true,
                      maxTicksLimit: 2,
                      beginAtZero: true,
                    },
                    gridLines: {
                      display: false,
                    },
                  },
                ],
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function AvailableSpotsChart({ instruments, participants }) {
  const countParticipantsByInstrument = useMemo(() => {
    return instruments.map(({ name: instrumentName }) => ({
      instrumentName,
      participantsCount: participants.filter(
        ({ instrument }) => instrument.name === instrumentName
      ).length,
    }));
  }, [instruments, participants]);

  const availableSpotsData = useMemo(() => {
    const maxSpots = instruments.reduce(
      (total, { max_attendants }) => total + max_attendants,
      0
    );

    return {
      labels: [...instruments.map(({ name }) => name), 'Remaining Spots'],
      datasets: [
        {
          backgroundColor: [
            '#f28939',
            '#39998e',
            '#347dca',
            '#ff4557',
            '#57455a',
            '#b1b1b1',
          ],
          borderWidth: 1,
          data: [
            ...countParticipantsByInstrument.map(
              ({ participantsCount }) => participantsCount
            ),
            maxSpots - participants.length,
          ],
          label: 'remaining spots',
        },
      ],
    };
  }, [instruments, countParticipantsByInstrument, participants.length]);

  return (
    <div className="chart-grid">
      <div className="chart-card">
        <div className="chart-remaining-spots" style={{ height: '300px' }}>
          <Doughnut
            data={availableSpotsData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              title: { text: 'total remaining spots', display: true },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function UnderagePercentageChart({ participants }) {
  const underageData = useMemo(() => {
    const numUnderage = participants.filter(({ is_underage }) => is_underage)
      .length;

    return {
      labels: ['Underage Participants', 'Adult Participants'],
      datasets: [
        {
          backgroundColor: ['#39998e', '#57455a'],
          borderWidth: 1,
          data: [numUnderage, participants.length - numUnderage],
          label: 'percentage of underage participants',
        },
      ],
    };
  }, [participants]);

  return (
    <div className="chart-grid">
      <div className="chart-card">
        <div className="chart-underage" style={{ height: '300px' }}>
          <Doughnut
            data={underageData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              title: {
                text: 'Percentage of underage attendants',
                display: true,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function AgeDistributionChart({ participants }) {
  const ageFreqData = useMemo(() => {
    const agesArray = participants
      .map(({ date_of_birth }) =>
        moment(process.env.REACT_APP_COURSE_START).diff(date_of_birth, 'years')
      )
      .sort((a, b) => (a < b ? -1 : 1));

    const ageFrequency = agesArray.reduce((ageCounts, currentAge) => {
      const newCount = (ageCounts.get(currentAge) || 0) + 1;
      ageCounts.set(currentAge, newCount);
      return ageCounts;
    }, new Map());

    return {
      labels: [...ageFrequency.keys()],
      datasets: [
        {
          backgroundColor: '#ff77006a',
          borderWidth: 2,
          borderColor: '#ff7900',
          data: [...ageFrequency.values()],
          label: 'age distribution',
        },
      ],
    };
  }, [participants]);

  return (
    <div className="chart-grid">
      <div className="chart-card">
        <div
          className="chart-ocupation-instrument"
          style={{ height: '350px', width: '350px' }}
        >
          <Line
            data={ageFreqData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              title: { text: 'age distribution', display: true },
              legend: { display: false },
              scales: {
                xAxes: [
                  {
                    ticks: {
                      min: 0,
                      max: 100,
                      maxTicksLimit: 10,
                    },
                  },
                ],
                yAxes: [
                  {
                    ticks: {
                      autoSkip: true,
                      beginAtZero: true,
                      stepSize: 1,
                    },
                    gridLines: {
                      display: false,
                    },
                  },
                ],
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
export default GroupsDisplay;
