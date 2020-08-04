import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import ApiClient from '@/services/ApiClient';
import { useAuth0 } from "@auth0/auth0-react";
import './GroupsDisplay.css'

const GroupsDisplay = ({ participants, instruments, setInstruments}) => {
  const [underageData, setUnderageData] = useState({});
  const [instrMaxDistributionData, setInstrMaxDistributionData] = useState({});
  const [participantsDitrByInstr, setParticipantsDitrByInstr] = useState({});
  const [availableSpotsData, setAvailableSpotsData] = useState({});
  const [ageFreqData, setAgeFreqData] = useState({});
  const [ageFrequency, setAgeFrequency] = useState({});
  const [numParticipants, setNumParticipants] = useState(0);
  const [numUnderage, setNumUnderage] = useState(0);
  const [instrumentNames, setInstrumentNames] = useState([]);
  const [instrMaxSpots, setInstrMaxSpots] = useState([]);
  const [instrDistribution, setInstrDistribution] = useState({});
  const [maxSpots, setMaxSpots] = useState(0);
  const [instrClone, setInstrClone] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  const generateData = () => {
    const underageParticipants = [];
    const instrNamesArray = [];
    const instrMaxArray = [];
    const agesArray = [];
    const ageFreq = {}
    const instrumentDistribution = {
      Fiddle: [],
      Cello: [],
      Guitar: [],
      Flute: [],
      'Fiddle Beginner': []
    };
    const totalSpots = instrMaxSpots.reduce((acc, el) => (acc + el),0);
    participants.forEach(participant => {
      participant.is_underage && underageParticipants.push(participant);
      instrumentDistribution[participant.instrument.name].push(participant)
      agesArray.push(moment(process.env.REACT_APP_COURSE_START).diff(participant.date_of_birth, 'years'))
    })
    instruments.map(instr => {
      instrNamesArray.push(instr.name)
      instrMaxArray.push(instr.max_attendants)
      return true;
    })
    if (agesArray) {
      for (let el of agesArray){
        if (ageFreq.hasOwnProperty(el)) ageFreq[el] += 1;
        else ageFreq[el] = 1;
      }
    }
    setNumParticipants(participants.length);
    setNumUnderage(underageParticipants.length);
    setInstrumentNames(instrNamesArray);
    setInstrMaxSpots(() => instrMaxArray);
    setInstrDistribution(() => instrumentDistribution);
    setMaxSpots(() => totalSpots);
    setAgeFrequency(ageFreq);
  }

  const chart = () => {
    setUnderageData({
      labels: ['Underage Participants', 'Adult Participants'],
      datasets: [
        {
          label: 'percentage of underage participants',
          data: [numUnderage, numParticipants - numUnderage],
          backgroundColor: ['#39998e', '#57455a'],
          borderWidth: 1
        }
      ]
    });
    setInstrMaxDistributionData({
      labels: instrumentNames,
      datasets: [{
        label: 'distribution of max attendants per instrument',
        data: instrMaxSpots,
        backgroundColor: ['#f28939', '#39998e', '#347dca', '#ff4557', '#57455a'],
        borderWidth: 1
      }]
    });
    (instrDistribution['Fiddle']) && setParticipantsDitrByInstr({
      labels: instrumentNames,
      datasets: [{
        label: 'registrered participants',
        data: [
          instrDistribution['Fiddle'].length,
          instrDistribution['Cello'].length,
          instrDistribution['Guitar'].length,
          instrDistribution['Flute'].length,
          instrDistribution['Fiddle Beginner'].length
        ],
        backgroundColor: ['#f7bd92', '#89cfc7', '#7ea4cc', '#ff808c', '#a17fa7']
      },
      {
        label: 'maximum attendants',
        data: instrMaxSpots,
        backgroundColor: ['#f28939', '#39998e', '#347dca', '#ff4557', '#571f61']
      }
      ]
    });
    (instrDistribution['Fiddle']) && setAvailableSpotsData({
      labels: [...instrumentNames, 'Remaining Spots'],
      datasets: [{
        label: 'remaining spots',
        data: [
          instrDistribution['Fiddle'].length,
          instrDistribution['Cello'].length,
          instrDistribution['Guitar'].length,
          instrDistribution['Flute'].length,
          instrDistribution['Fiddle Beginner'].length,
          maxSpots - participants.length
        ],
        backgroundColor: ['#f28939', '#39998e', '#347dca', '#ff4557', '#57455a', '#b1b1b1']
      }]
    });
    setAgeFreqData({
      labels: Object.keys(ageFrequency),
      datasets: [{
        label: 'age distribution',
        data: Object.values(ageFrequency),
        backgroundColor: '#ff77006a',
        borderColor: '#ff7900',
        borderWidth: 2,
      }]
    })
  }

  useEffect(() => {
    generateData()
    setInstrClone([...instruments])
  }, [participants, instruments]);

  useEffect(() => {
    chart()
  }, [numUnderage, numParticipants, instrMaxSpots, maxSpots]);

  const handleChange = ({ target }) => {
    const newInstr = instrClone.map(instr => {
      if (instr.name !== target.name) return instr;
      else {
        return {...instr, max_attendants: +target.value}
      }
    })
    setInstrClone(newInstr);
  }

  const submitMaxValues = (e) => {
    e.preventDefault();
    getAccessTokenSilently()
      .then(token => ApiClient.putEditInstrument(instrClone, token))
      .then(instr => {
        console.log('fetch return', instr[0].max_attendants)
        setInstruments(instr);
        setInstrClone(instr);
      })
  }

  const cancelChanges = (e) => {
    e.preventDefault();
    setInstrClone(instruments)
  };

  return (
    <div className="charts-container" >
      <div className="chart-grid">
        <div className="chart-card">
          <div className="groups-setup">
            <form>
              <div className="fields">
                {instrClone.length && console.log(instrClone[0].max_attendants)}
                {
                  instrClone.length && instrClone.map(instr => (
                    <div key={'instr'+instr.id} className="graph-field">
                      <label htmlFor={instr.name}>{instr.name}</label>
                      <input type="number" min="0" name={instr.name} value={instr.max_attendants} onChange={handleChange}/>
                    </div>
                  ))
                }
              </div>
              <div className="total-participants">
                Total Spots: {instrClone.length && instrClone.reduce((acc, el) => acc + el.max_attendants, 0)}
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
        <div className="chart-card" >
          <div className="chart-max-instr-distribution" style={{height: '300px'}}>
            <Doughnut data={instrMaxDistributionData} options={{
              maintainAspectRatio: false,
              responsive: true,
              title: {text: 'Distribution of spots per instrument', display: true}
              }}
            />
          </div>
        </div>
      </div>
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-ocupation-instrument" style={{height: '300px'}}>
            <Bar data={participantsDitrByInstr} options={{
              maintainAspectRatio: false,
              responsive: true,
              title: {text: 'Group ocupation vs maximum attendants', display: true},
              legend: {display: false},
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
                    }
                  }
                ]
              }
            }}/>
          </div>
        </div>
      </div>
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-remaining-spots" style={{height: '300px'}}>
            <Doughnut data={availableSpotsData} options={{
              maintainAspectRatio: false,
              responsive: true,
              title: {text: 'total remaining spots', display: true},
            }}/>
          </div>
        </div>
      </div>
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-underage" style={{height: '300px'}}>
            <Doughnut data={underageData} options={{
              maintainAspectRatio: false,
              responsive: true,
              title: {text: 'Percentage of underage attendants', display: true},
            }}/>
          </div>
        </div>
      </div>
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-ocupation-instrument" style={{height: '350px', width: '350px'}}>
            <Line data={ageFreqData} options={{
              maintainAspectRatio: false,
              responsive: true,
              title: {text: 'age distribution', display: true},
              legend: {display: false},
              scales: {
                xAxes: [
                  {
                    ticks: {
                      min: 0,
                      max: 100,
                      maxTicksLimit: 10
                    }
                  }
                ],
                yAxes: [
                  {
                    ticks: {
                      autoSkip: true,
                      beginAtZero: true,
                      stepSize: 1
                    },
                    gridLines: {
                      display: false,
                    }
                  }
                ]
              }
            }}/>
          </div>
        </div>
      </div>
      <div className="white-space"></div>
    </div>
  );
}

export default GroupsDisplay;
