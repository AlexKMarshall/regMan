import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import ApiClient from '@app/services/ApiClient';
import { useAuth0 } from '@auth0/auth0-react';
import './GroupsDisplay.css';

/**
 * Don't be scared! There are a lot of state properties. All of them are used for statistics.
 * They are set in the generateData function.
 * The chart function creates objects that chart.js can insterpret to render the graphs.
 * 2 useEffect function set the data for the graphs at the begining and whenever there are changes.
 *
 * handleChange, submitMaxValues & cancelChanges are used to control the form that modifies the max_attendants property of the instruments.
 */
const GroupsDisplay = ({ participants, instruments, setInstruments }) => {
  const [old_underageData, old_setUnderageData] = useState({});
  const [
    old_participantsDitrByInstr,
    old_setParticipantsDitrByInstr,
  ] = useState({});
  const [old_availableSpotsData, old_setAvailableSpotsData] = useState({});
  const [old_ageFreqData, old_setAgeFreqData] = useState({});
  const [Old_ageFrequency, old_setAgeFrequency] = useState({});
  const [old_numParticipants, old_setNumParticipants] = useState(0);
  const [old_numUnderage, old_setNumUnderage] = useState(0);
  const [old_instrumentNames, old_setInstrumentNames] = useState([]);
  const [old_instrMaxSpots, old_setInstrMaxSpots] = useState([]);
  const [old_instrDistribution, old_setInstrDistribution] = useState({});
  const [old_maxSpots, old_setMaxSpots] = useState(0);
  const [old_instrClone, old_setInstrClone] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

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

  const generateData = () => {
    const underageParticipants = [];
    const instrNamesArray = [];
    const instrMaxArray = [];
    const agesArray = [];
    const ageFreq = {};
    const instrumentDistribution = {
      Fiddle: [],
      Cello: [],
      Guitar: [],
      Flute: [],
      'Fiddle Beginner': [],
    };
    const totalSpots = old_instrMaxSpots.reduce((acc, el) => acc + el, 0);
    participants.forEach((participant) => {
      participant.is_underage && underageParticipants.push(participant);
      instrumentDistribution[participant.instrument.name].push(participant);
      agesArray.push(
        moment(process.env.REACT_APP_COURSE_START).diff(
          participant.date_of_birth,
          'years'
        )
      );
    });
    instruments.map((instr) => {
      instrNamesArray.push(instr.name);
      instrMaxArray.push(instr.max_attendants);
      return true;
    });
    if (agesArray) {
      for (let el of agesArray) {
        if (ageFreq.hasOwnProperty(el)) ageFreq[el] += 1;
        else ageFreq[el] = 1;
      }
    }
    old_setNumParticipants(participants.length);
    old_setNumUnderage(underageParticipants.length);
    old_setInstrumentNames(instrNamesArray);
    old_setInstrMaxSpots(() => instrMaxArray);
    old_setInstrDistribution(() => instrumentDistribution);
    old_setMaxSpots(() => totalSpots);
    old_setAgeFrequency(ageFreq);
  };

  const chart = () => {
    old_setUnderageData({
      labels: ['Underage Participants', 'Adult Participants'],
      datasets: [
        {
          label: 'percentage of underage participants',
          data: [old_numUnderage, old_numParticipants - old_numUnderage],
          backgroundColor: ['#39998e', '#57455a'],
          borderWidth: 1,
        },
      ],
    });
    old_instrDistribution['Fiddle'] &&
      old_setParticipantsDitrByInstr({
        labels: old_instrumentNames,
        datasets: [
          {
            label: 'registrered participants',
            data: [
              old_instrDistribution['Fiddle'].length,
              old_instrDistribution['Cello'].length,
              old_instrDistribution['Guitar'].length,
              old_instrDistribution['Flute'].length,
              old_instrDistribution['Fiddle Beginner'].length,
            ],
            backgroundColor: [
              '#f7bd92',
              '#89cfc7',
              '#7ea4cc',
              '#ff808c',
              '#a17fa7',
            ],
          },
          {
            label: 'maximum attendants',
            data: old_instrMaxSpots,
            backgroundColor: [
              '#f28939',
              '#39998e',
              '#347dca',
              '#ff4557',
              '#571f61',
            ],
          },
        ],
      });
    old_instrDistribution['Fiddle'] &&
      old_setAvailableSpotsData({
        labels: [...old_instrumentNames, 'Remaining Spots'],
        datasets: [
          {
            label: 'remaining spots',
            data: [
              old_instrDistribution['Fiddle'].length,
              old_instrDistribution['Cello'].length,
              old_instrDistribution['Guitar'].length,
              old_instrDistribution['Flute'].length,
              old_instrDistribution['Fiddle Beginner'].length,
              old_maxSpots - participants.length,
            ],
            backgroundColor: [
              '#f28939',
              '#39998e',
              '#347dca',
              '#ff4557',
              '#57455a',
              '#b1b1b1',
            ],
          },
        ],
      });
    old_setAgeFreqData({
      labels: Object.keys(Old_ageFrequency),
      datasets: [
        {
          label: 'age distribution',
          data: Object.values(Old_ageFrequency),
          backgroundColor: '#ff77006a',
          borderColor: '#ff7900',
          borderWidth: 2,
        },
      ],
    });
  };

  useEffect(() => {
    generateData();
    old_setInstrClone([...instruments]);
    old_setMaxSpots(
      instruments.reduce((acc, el) => acc + el.max_attendants, 0)
    );
  }, [participants, instruments]);

  useEffect(() => {
    chart();
  }, [old_numUnderage, old_numParticipants, old_instrMaxSpots, old_maxSpots]);

  const handleChange = ({ target }) => {
    const newInstr = old_instrClone.map((instr) => {
      if (instr.name !== target.name) return instr;
      else {
        return { ...instr, max_attendants: +target.value };
      }
    });
    old_setInstrClone(newInstr);
  };

  const submitMaxValues = (e) => {
    e.preventDefault();
    getAccessTokenSilently()
      .then((token) => ApiClient.putEditInstrument(old_instrClone, token))
      .then((instr) => {
        console.log('fetch return', instr[0].max_attendants);
        setInstruments(instr);
        old_setInstrClone(instr);
      });
  };

  const cancelChanges = (e) => {
    e.preventDefault();
    old_setInstrClone(instruments);
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
                {old_instrClone.length &&
                  console.log(old_instrClone[0].max_attendants)}
                {old_instrClone.length &&
                  old_instrClone.map((instr) => (
                    <div key={'instr' + instr.id} className="graph-field">
                      <label htmlFor={instr.name}>{instr.name}</label>
                      <input
                        type="number"
                        min="0"
                        name={instr.name}
                        value={instr.max_attendants}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
              </div>
              <div className="total-participants">
                Total Spots:{' '}
                {old_instrClone.length &&
                  old_instrClone.reduce(
                    (acc, el) => acc + el.max_attendants,
                    0
                  )}
              </div>
              <div className="groups-setup-btn">
                <button onClick={submitMaxValues}>Update Group Limits</button>
                <button onClick={cancelChanges}>Cancel Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
      <div className="chart-grid">
        <div className="chart-card">
          <div
            className="chart-ocupation-instrument"
            style={{ height: '300px' }}
          >
            <Bar
              data={old_participantsDitrByInstr}
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
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-remaining-spots" style={{ height: '300px' }}>
            <Doughnut
              data={old_availableSpotsData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                title: { text: 'total remaining spots', display: true },
              }}
            />
          </div>
        </div>
      </div>
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-underage" style={{ height: '300px' }}>
            <Doughnut
              data={old_underageData}
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
      <div className="chart-grid">
        <div className="chart-card">
          <div
            className="chart-ocupation-instrument"
            style={{ height: '350px', width: '350px' }}
          >
            <Line
              data={old_ageFreqData}
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
      <div className="white-space"></div>
    </div>
  );
};

export default GroupsDisplay;
