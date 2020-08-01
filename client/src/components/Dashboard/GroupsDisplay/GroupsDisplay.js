import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './GroupsDisplay.css'

const GroupsDisplay = ({ participants, instruments}) => {
  const [underageData, setUnderageData] = useState({});
  const [instrMaxDistributionData, setInstrMaxDistributionData] = useState({});
  const [numParticipants, setNumParticipants] = useState(0);
  const [numUnderage, setNumUnderage] = useState(0);
  const [instrumentNames, setInstrumentNames] = useState([]);
  const [instrMaxSpots, setInstrMaxSpots] = useState([]);

  const generateData = () => {
    setNumParticipants(participants.length)
    const underageParticipants = participants.filter(participant => participant.is_underage)
    setNumUnderage(underageParticipants.length)
    const instrNamesArray = []
    const instrMaxArray = []
    instruments.map(instr => {
      instrNamesArray.push(instr.name)
      instrMaxArray.push(instr.max_attendants)
    })
    setInstrumentNames(instrNamesArray);
    setInstrMaxSpots(instrMaxArray);
  }

  const chart = () => {
    console.log('data for the chart', numParticipants, numUnderage)
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
    })
    setInstrMaxDistributionData({
      labels: instrumentNames,
      datasets: [{
        label: 'distribution of max attendants per instrument',
        data: instrMaxSpots,
        backgroundColor: ['#f28939', '#39998e', '#aebfd1', '#ff4557', '#57455a'],
        borderWidth: 1
      }]
    })
  }

  useEffect(() => {
    generateData()
  }, [participants, instruments]);

  useEffect(() => {
    chart()
  }, [numUnderage, numParticipants]);

  return (
    <div className="charts-container" >
      {console.log(numUnderage, numParticipants, underageData)}
      <div className="chart-underage" style={{height: '400px', width: '400px'}}>
        <Doughnut data={underageData} options={{
          responsive: true,
          title: {text: 'Percentage of underage attendants', display: true},
          // scales: {
          //   yAxes: [
          //     {
          //       ticks: {
          //         autoSkip: true,
          //         maxTicksLimit: 10,
          //         beginAtZero: true,
          //       },
          //       gridLines: {
          //         display: false,
          //       }
          //     }
          //   ]
          // }

        }}/>
      </div>
      <div className="chart-max-instr-distribution" style={{height: '400px', width: '400px'}}>
        <Doughnut data={instrMaxDistributionData} options={{
          responsive: true,
          title: {text: 'Distribution of spots per instrument', display: true}
          }}
        />
      </div>
    </div>
  );
}

export default GroupsDisplay;
