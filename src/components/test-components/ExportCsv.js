import React from 'react';
import { gql, useQuery, useReactiveVar } from '@apollo/client'
import { CircularProgress } from '@mui/material';
import { gridSelectionsVar } from '../../cache';
import { camelizeKeys } from '../../functions/commonFunctions';
import { CSVLink } from "react-csv";

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



const ExportCsv = () => {
    const selectedApplication = useReactiveVar(gridSelectionsVar).selectedApplication

    const [appHeader, setAppHeader] = React.useState([])
    const [appAreas, setAppAreas] = React.useState()
    const [appImages, setAppImages] = React.useState()
    const [appItems, setAppItems] = React.useState()
    const [appLocations, setLocations] = React.useState()
    const [appWorksheets, setAppWorksheets] = React.useState()

    const { loading } = useQuery(GET_APPLICATION_SUBMISSION_DATA, {
        variables: { id: 47 },
        onCompleted: data => {
            setAppHeader([camelizeKeys(
                data.submittedApplicationByApplicationId.applicationHeader[0]
            )])
        }
    })

    if (loading) return <CircularProgress />
    return (
        <div>
            <CSVLink data={appHeader}>Download me</CSVLink>;
        </div>
    );
};

export default ExportCsv;