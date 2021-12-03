import React from 'react';
import PeriodSelection from './PeriodSelection';
import PeriodSummaryData from './PeriodData';
import {gql, useLazyQuery} from '@apollo/client'
import SupervisorChart from './SupervisorChart';
import OrderChart from './OrderChart';
import {Grid, Box} from '@mui/material'
import AreaChart from './AreaChart';
import WorktypeChart from './WorktypeChart';
import PeriodOrderStats from './PeriodOrderStats';
import PeriodSupervisorStats from './PeriodSupervisorStats';
import PeriodActivityStats from './PeriodActivityStats';
import {v4 as uuidv4} from 'uuid'
import {formatNumberNoDecimals, formatNumberTwoDecimals} from '../../functions/commonFunctions';

const GET_PERIOD_ANALYSIS_DATA = gql`
query GetPeriodAnalysisData($period: Int!) {
  query {
    periodAnalysisSupervisorValues(condition: {periodNumber: $period}orderBy: VALUE_COMPLETE_DESC first: 10) {
      nodes {
        periodNumber
        supervisorName
        valueComplete
      }
    }
    
    periodAnalysisAreaOrderValues(condition: {periodNumber: $period}) {
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
    periodAnalysisAreaValues(condition: {periodNumber: $period}orderBy: AREA_ID_ASC) {
      nodes {
        area
        periodNumber
        valueComplete
      }
    }
    periodAnalysisWorktypeValues(condition: {periodNumber: $period}) {
      nodes {
        periodNumber
        worktype
        valueComplete
      }
    }
    periodOrderStats(condition: {periodNumber: $period}orderBy: VALUE_COMPLETE_DESC) {
      nodes {
        itemCount
        locationCount
        orderNumber
        periodNumber
        projectTitle
        valueComplete
        averageLocationValue
        averageItemValue
      }
    }
    periodSupervisorStats(condition: {periodNumber: $period}orderBy: VALUE_COMPLETE_DESC) {
      nodes {
        averageItemValue
        averageLocationValue
        averageOrderValue
        itemCount
        locationCount
        supervisorName
        valueComplete
        periodNumber
        orderCount
      }
    }
     periodAnalysisActivityValues(condition: {periodNumber: $period}orderBy: VALUE_COMPLETE_DESC) {
      nodes {
        activityCode
        activityDescription
        periodNumber
        qtyComplete
        valueComplete
      }
    }
  }
}

`
const Analysis = () => {

	const [supervisorData, setSupervisorData] = React.useState (false)
	const [areaData, setAreaData] = React.useState (false)
	const [periodData, setPeriodData] = React.useState (false)
	const [orderData, setOrderData] = React.useState (false)
	const [worktypeData, setWorktypeData] = React.useState (false)
	const [periodOrderData, setPeriodOrderData] = React.useState (false)
	const [periodSupervisorData, setPeriodSupervisorData] = React.useState (false)
	const [activityData, setActivityData] = React.useState (false)

	const [getData, {called}] = useLazyQuery (GET_PERIOD_ANALYSIS_DATA, {
			onCompleted: data => {
				setSupervisorData (data.query.periodAnalysisSupervisorValues.nodes.map (item => ({
					...item,
					valueComplete: Number (item.valueComplete)
				})))
				setAreaData (data.query.periodAnalysisAreaValues.nodes.map (item => ({
					...item,
					valueComplete: Number (item.valueComplete)
				})))
				setPeriodData (data.query.periodWithValues.nodes)
				setOrderData (data.query.periodAnalysisAreaOrderValues.nodes.map (item => ({
					...item,
					valueComplete: Number (item.valueComplete)
				})))
				setWorktypeData (data.query.periodAnalysisWorktypeValues.nodes.map (item => ({
					...item,
					valueComplete: Number (item.valueComplete)
				})))
				setPeriodOrderData (data.query.periodOrderStats.nodes.map (item => ({
					...item, valueComplete: formatNumberNoDecimals (Number (item.valueComplete)),
					averageLocationValue: formatNumberNoDecimals (Number (item.averageLocationValue)),
					averageItemValue: formatNumberNoDecimals (Number (item.averageItemValue)), id: uuidv4 ()
				})))
				setPeriodSupervisorData (data.query.periodSupervisorStats.nodes.map (item => ({
					...item, valueComplete: formatNumberNoDecimals (Number (item.valueComplete)),
					averageLocationValue: formatNumberNoDecimals (Number (item.averageLocationValue)),
					averageItemValue: formatNumberNoDecimals (Number (item.averageItemValue)),
					averageOrderValue: formatNumberNoDecimals (Number (item.averageOrderValue)),
					id: uuidv4 ()
				})))
				setActivityData (data.query.periodAnalysisActivityValues.nodes.map (item => ({
					...item,
					qtyComplete: formatNumberTwoDecimals (Number (item.qtyComplete)),
					valueComplete: formatNumberNoDecimals (Number (item.valueComplete)),
					id: uuidv4 ()
				})))
			}
		}
	)

	return (
		<>
			<Box m={2}>
				<PeriodSelection getData={getData}/>
			</Box>
			{called &&
				<>
					<Box ml={1.75} mr={1.75}>
						<PeriodSummaryData data={periodData}/>
					</Box>
					<Box m={2}>
						<Grid container spacing={2}>
							<Grid item xs={3}><OrderChart data={orderData}/></Grid>
							<Grid item xs={3}><AreaChart data={areaData}/></Grid>
							<Grid item xs={3}><SupervisorChart data={supervisorData}/></Grid>
							<Grid item xs={3}><WorktypeChart data={worktypeData}/></Grid>
						</Grid>
						<br/>
						<Grid container spacing={2}>
							<Grid item xs={4}><PeriodOrderStats data={periodOrderData}/></Grid>
							<Grid item xs={4}><PeriodSupervisorStats data={periodSupervisorData}/></Grid>
							<Grid item xs={4}><PeriodActivityStats data={activityData}/></Grid>
						</Grid>
					</Box>
				</>}
		</ >
	);
};

export default Analysis;