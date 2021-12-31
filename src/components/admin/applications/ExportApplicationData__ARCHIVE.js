import React from 'react';
import { gql, useQuery, useReactiveVar } from '@apollo/client'
import { CircularProgress } from '@mui/material';
import { gridSelectionsVar } from '../../../cache';
import XLSX from "xlsx";
import ActionButton from '../../ui-components/buttons/ActionButton'


const GET_APPLICATION_SUBMISSION_DATA = gql`
query GetApplicationSubmissionData($id:Int!) {
    submittedApplicationByApplicationId(applicationId: $id) {
    applicationHeader
    applicationId
    areas
    images
    orderdetails
    orderheaders
    sitelocations
    worksheets
  }
}
`

const ExportApplicationData = () => {

	const selectedApplication = useReactiveVar(gridSelectionsVar).selectedApplication

	const [appHeader, setAppHeader] = React.useState([])
	const [appAreas, setAppAreas] = React.useState([])
	const [appImages, setAppImages] = React.useState([])
	const [appItems, setAppItems] = React.useState([])
	const [appLocations, setAppLocations] = React.useState([])
	const [appWorksheets, setAppWorksheets] = React.useState([])
	const [appOrders, setAppOrders] = React.useState([])

	const { loading } = useQuery(GET_APPLICATION_SUBMISSION_DATA, {
		variables: { id: selectedApplication.id },
		onCompleted: data => {
			setAppHeader(data.submittedApplicationByApplicationId.applicationHeader
				/* data.submittedApplicationByApplicationId.applicationHeader.map(item => (
					{
						...item,
						date_submitted: convertDateToLocal(item.date_submitted),
						application_date: convertDateToLocal(item.application_date),
						this_application_value: formatNumberForExcel(item.this_application_value),
						cumulative_application_value: formatNumberForExcel(item.cumulative_application_value),
						prev_cumulative_application_value: formatNumberForExcel(item.prev_cumulative_application_value)
					})) */
			)
			setAppAreas(
				data.submittedApplicationByApplicationId.areas
			)
			setAppImages(
				data.submittedApplicationByApplicationId.images
			)
			setAppItems(
				data.submittedApplicationByApplicationId.orderdetails
			)
			setAppLocations(
				data.submittedApplicationByApplicationId.sitelocations
			)
			setAppWorksheets(
				data.submittedApplicationByApplicationId.worksheets
			)
			setAppOrders(
				data.submittedApplicationByApplicationId.orderheaders
			)
		}
	})
	const exportJS = () => {

		const wb = XLSX.utils.book_new();
		const w1 = XLSX.utils.json_to_sheet(appHeader);
		const w2 = XLSX.utils.json_to_sheet(appAreas)
		const w3 = XLSX.utils.json_to_sheet(appLocations)
		const w4 = XLSX.utils.json_to_sheet(appItems)
		const w5 = XLSX.utils.json_to_sheet(appWorksheets)
		const w6 = XLSX.utils.json_to_sheet(appOrders)

		XLSX.utils.book_append_sheet(wb, w1, "Application Header");
		XLSX.utils.book_append_sheet(wb, w2, "Application Area");
		XLSX.utils.book_append_sheet(wb, w3, "Application Locations");
		XLSX.utils.book_append_sheet(wb, w4, "Application Items");
		XLSX.utils.book_append_sheet(wb, w5, "Application Worksheets");
		XLSX.utils.book_append_sheet(wb, w6, "Application Orders");

		XLSX.writeFile(wb, "Application.xlsx");
	}

	if (loading) return <CircularProgress />
	return (
		<div>
			<ActionButton label="EXPORT DATA" onClick={exportJS}
				disabled={
					selectedApplication === false ||
					selectedApplication.applicationSubmitted === false
				} />
		</div>
	);
};

export default ExportApplicationData;