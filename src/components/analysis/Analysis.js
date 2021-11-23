import React from 'react';
import PeriodSelection from './PeriodSelection';
import PeriodSummaryData from './PeriodData';
import { gql, useLazyQuery } from '@apollo/client'
import SupervisorChart from './SupervisorChart';
import OrderChart from './OrderChart';
import { Grid } from '@mui/material'
import AreaChart from './AreaChart';
import WorktypeChart from './WorktypeChart';

const GET_PERIOD_ANAYSIS_DATA = gql`
query GetPeriodAnalysisData($period: Int!) {
  query {
    periodAnalysisSupervisorValues(condition: {periodNumber: $period}orderBy: VALUE_COMPLETE_DESC first: 10) {
      nodes {
        periodNumber
        supervisorName
        valueComplete
      }
    }
    
    periodAnaysisAreaOrderValues(condition: {periodNumber: $period}) {
      nodes {
        orderNumber
        periodNumber
        projectTitle
        valueComplete
      }
    }
    periodWithValues(condition: {periodNumber: $period}) {
      nodes {
        closed
        current
        id
        periodNumber
        week
        weekCommencingDate
        weekEndingDate
        worksValueClosed
        worksValueCurrent
        year
      }
    }
    periodAnaysisAreaValues(condition: {periodNumber: $period}) {
      nodes {
        area
        periodNumber
        valueComplete
      }
    }
    periodAnaysisWorktypeValues(condition: {periodNumber: $period}) {
      nodes {
        periodNumber
        worktype
        valueComplete
      }
    }
  }
}

`
const Analysis = () => {

  const [supervisorData, setSupervisorData] = React.useState(false)
  const [areaData, setAreaData] = React.useState(false)
  const [periodData, setPeriodData] = React.useState(false)
  const [orderData, setOrderData] = React.useState(false)
  const [worktypeData, setWorktypeData] = React.useState(false)

  const [getData, { called }] = useLazyQuery(GET_PERIOD_ANAYSIS_DATA, {
    onCompleted: data => {
      setSupervisorData(data.query.periodAnalysisSupervisorValues.nodes.map(item => ({ ...item, valueComplete: Number(item.valueComplete) })))
      setAreaData(data.query.periodAnaysisAreaValues.nodes.map(item => ({ ...item, valueComplete: Number(item.valueComplete) })))
      setPeriodData(data.query.periodWithValues.nodes)
      setOrderData(data.query.periodAnaysisAreaOrderValues.nodes.map(item => ({ ...item, valueComplete: Number(item.valueComplete) })))
      setWorktypeData(data.query.periodAnaysisWorktypeValues.nodes.map(item => ({ ...item, valueComplete: Number(item.valueComplete) })))
    }
  }
  )

  return (
    <div>
      <PeriodSelection getData={getData} />
      {called &&
        <>
          <PeriodSummaryData data={periodData} />
          <Grid container spacing={1} >
            <Grid item xs={3} ><OrderChart data={orderData} /></Grid>
            <Grid item xs={3} ><AreaChart data={areaData} /></Grid>
            <Grid item xs={3} ><SupervisorChart data={supervisorData} /></Grid>
            <Grid item xs={3}  ><WorktypeChart data={worktypeData} /></Grid>
          </Grid>
        </>}
    </div >
  );
};

export default Analysis;