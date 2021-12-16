import React from 'react';
import ReactExport from "react-data-export";
import { gql, useQuery, useReactiveVar } from '@apollo/client'
import { CircularProgress } from '@mui/material';
import { gridSelectionsVar } from '../../cache';
import { camelizeKeys, fixKeys, SnakeCaseToWords, capitalizeFirstLetter, properCase } from '../../functions/commonFunctions';

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



const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const dataSet1 = [
    {
        name: "Johson",
        amount: 30000,
        sex: 'M',
        is_married: true
    },
    {
        name: "Monika",
        amount: 355000,
        sex: 'F',
        is_married: false
    },
    {
        name: "John",
        amount: 250000,
        sex: 'M',
        is_married: false
    },
    {
        name: "Josef",
        amount: 450500,
        sex: 'M',
        is_married: true
    }
];

var dataSet2 = [
    {
        name: "Johnson",
        total: 25,
        remainig: 16
    },
    {
        name: "Josef",
        total: 25,
        remainig: 7
    }
];

const convertFromSnakeCase = (data) => {
    console.log(data[0], "CONVERTED")
    console.log(SnakeCaseToWords(data))
    console.log(camelizeKeys(data))
}


//const convertFromSnakeCase = (data) => {
//   data[0].replace(/_/g, ' ').replace(/\w\S*/g, function (word) {
//       return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
//   });
//}
const multiDataSet = [
    {
        columns: [
            { title: "Application Number" },//pixels width 
            { title: "Application Reference" },//char width 
            { title: "Application Date" },
            { title: "Submission Date" },
            { title: "Submission Reference" },
            { title: "Areas" },
            { title: "Orders" },
            { title: "Locations", width: { wpx: 90 } },
            { title: "Items", width: { wpx: 90 } },
            { title: "Images", width: { wpx: 90 } },
            { title: "Previous Application Value", width: { wpx: 90 } },
            { title: "This Application Value", width: { wpx: 90 } },
            { title: "Cumulative Application Value", width: { wpx: 90 } },
        ],
        data: [
            [
                { value: "H1" },
                { value: "Bold", style: { font: { bold: true } } },
                { value: "Red", style: { fill: { patternType: "solid", fgColor: { rgb: "FFFF0000" } } } },
                { value: "Red", style: { fill: { patternType: "solid", fgColor: { rgb: "FFFF0000" } } } },
            ],
            [
                { value: "H2", style: { font: { sz: "18", bold: true } } },
                { value: "underline", style: { font: { underline: true } } },
                { value: "Blue", style: { fill: { patternType: "solid", fgColor: { rgb: "FF0000FF" } } } },
            ],
            [
                { value: "H3", style: { font: { sz: "14", bold: true } } },
                { value: "italic", style: { font: { italic: true } } },
                { value: "Green", style: { fill: { patternType: "solid", fgColor: { rgb: "FF00FF00" } } } },
            ],
            [
                { value: "H4", style: { font: { sz: "12", bold: true } } },
                { value: "strike", style: { font: { strike: true } } },
                { value: "Orange", style: { fill: { patternType: "solid", fgColor: { rgb: "FFF86B00" } } } },
            ],
            [
                { value: "H5", style: { font: { sz: "10.5", bold: true } } },
                { value: "outline", style: { font: { outline: true } } },
                { value: "Yellow", style: { fill: { patternType: "solid", fgColor: { rgb: "FFFFFF00" } } } },
            ],
            [
                { value: "H6", style: { font: { sz: "7.5", bold: true } } },
                { value: "shadow", style: { font: { shadow: true } } },
                { value: "Light Blue", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } }
            ]
        ]
    }
];

const ExportToExcel = () => {
    const selectedApplication = useReactiveVar(gridSelectionsVar).selectedApplication

    const [appHeader, setAppHeader] = React.useState([])
    const [appAreas, setAppAreas] = React.useState([])
    const [appImages, setAppImages] = React.useState()
    const [appItems, setAppItems] = React.useState()
    const [appLocations, setLocations] = React.useState()
    const [appWorksheets, setAppWorksheets] = React.useState()

    const { loading } = useQuery(GET_APPLICATION_SUBMISSION_DATA, {
        variables: { id: 48 },
        onCompleted: data => {

            // console.log(Object.keys(data.submittedApplicationByApplicationId.applicationHeader[0]).map(item => capitalizeFirstLetter(properCase(item.replace(/_/g, ' ')))))
            setAppHeader(
                data.submittedApplicationByApplicationId.applicationHeader
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
            setLocations(
                data.submittedApplicationByApplicationId.sitelocations
            )
            setAppWorksheets(
                data.submittedApplicationByApplicationId.worksheets
            )
        }
    })

    //console.log(Object.keys(appHeader[0]).map(item => properCase(item.replace(/_/g, " "))))
    //console.log(Object.keys(appHeader.map(item => capitalizeFirstLetter(properCase(item.replace(/_/g, ' '))))))

    // console.log(Object.keys(appHeader));

    if (loading) return <CircularProgress />

    return (
        <ExcelFile element={<button>Download Data</button>}>
            <ExcelSheet data={appHeader} name="Application Header">
                <ExcelColumn label="Application Number" value="application_number" />
                <ExcelColumn label="Application Reference" value="application_reference" />
                <ExcelColumn label="Application Date" value="application_date" />
                <ExcelColumn label="Submission Date" value="date_submitted" />
                <ExcelColumn label="Submission Reference" value="submission_reference" />
                <ExcelColumn label="Area Count" value="area_count" />
                <ExcelColumn label="Order Count" value="order_count" />
                <ExcelColumn label="Location Count" value="location_count" />
                <ExcelColumn label="Item Count" value="item_count" />
                <ExcelColumn label="Image Count" value="image_count" />
                <ExcelColumn label="Previous Application Value" value="prev_cumulative_application_value" />
                <ExcelColumn label="This Application Value" value="this_application_value" />
                <ExcelColumn label="Cumulative Application Value" value="cumulative_application_value" />
            </ExcelSheet>
            <ExcelSheet data={dataSet2} name="Leaves">
                <ExcelColumn label="Name" value="name" />
                <ExcelColumn label="Total Leaves" value="total" />
                <ExcelColumn label="Remaining Leaves" value="remaining" />
            </ExcelSheet>
            <ExcelSheet dataSet={multiDataSet} name="TEST" />



        </ExcelFile>
    );
};

export default ExportToExcel;