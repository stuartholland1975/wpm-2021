import {generateObjects, ReactExcel, readFile} from '@ramonak/react-excel';
import React, {useState} from 'react';
import UploadButton from '../ui-components/buttons/UploadButton';
import {useHistory} from 'react-router-dom';
import {useQuery, gql, useLazyQuery, useMutation} from '@apollo/client';
import {gridSelectionsVar} from '../../cache';
import {Box} from '@mui/material';
import {fontWeight} from '@mui/system';
//import {UPLOAD_ORDER_TEMPLATE} from "../../graphql/mutations";
//import {GET_ORDER_HEADERS} from "../../graphql/queries";

const GET_PROJECT_TITLE = gql`
	query GetProjectTitle($id: Int!) {
		orderheader(id: $id) {
			projectTitle
		}
	}
`;
const GET_ACTIVITY_INFO = gql`
query getActivityInfo($codes: [String!]) {
   ratesetPrices(filter: {activitycode: {activityCode: {in: $codes}}}) {
    nodes {
      activitycodeId
      ratesetHeaderId
      id
      unitBaseLabour
      unitBaseOther
      activitycode {
        activityCode
      }
    }
    totalCount
  }
}
`

const CREATE_LOCATIONS = gql`
mutation CreateLocation($mnSitelocation: [SitelocationInput!]) {
  mnCreateSitelocation(
    input: {mnSitelocation: $mnSitelocation}
  ) {
    sitelocation {
      id
      reference
    }
  }
}
`

const GET_NEW_LOCATIONS = gql`
query GetNewLocations($orderheaderId: Int!) {
sitelocations(filter: {orderheaderId: {equalTo: $orderheaderId}}) {
    nodes {
      id
      reference
      worksheetReference
    }
  }
}
`

const CREATE_ORDERDETAIL = gql`
mutation CreateOrderdetail($input:  mnCreateOrderdetailInput!) {
  mnCreateOrderdetail(
    input: {mnOrderdetail: $input}
  ) {
    orderdetail {
      itemNumber
      id
    }
  }
}
`

const CHECK_ACTIVITY_CODE_EXISTS = gql`
query CheckActivitycodeExists($codes: [String!]) {
activitycodes(filter: {activityCode: {in: $codes}}) {
nodes {
id
activityCode}
 totalCount
}
}
`

function Item(props) {
  const {sx, ...other} = props;
  return (
    <Box
      sx={{
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    />
  );
}

const ImportData = () => {
  const [initialData, setInitialData] = useState(undefined);
  const [currentSheet, setCurrentSheet] = useState({});
  const [apiData, setApiData] = useState([]);
  const [finalData, setFinalData] = useState(([]))
  const [mutationData, setMutationData] = useState([]);
  const [ratesetCodes, setRatesetCodes] = useState([]);
  const [importedData, setImportedData] = useState([])
  const [orderLocations, setOrderLocations] = useState([])
  const [activityCodes, setActivityCodes] = useState([])
  const [activityCheck, setActivityCheck] = useState(false)


  const {data: header} = useQuery(GET_PROJECT_TITLE, {
    variables: {id: gridSelectionsVar().selectedOrder},
  });

  const [getActivityInfo] = useLazyQuery(GET_ACTIVITY_INFO, {
    onCompleted: data => updateInfo(data)
  })

  const [getNewLocations, {data: newLocationData}] = useLazyQuery(GET_NEW_LOCATIONS, {
    variables: {orderheaderId: gridSelectionsVar().selectedOrder},
  })

  const [createSitelocation] = useMutation(CREATE_LOCATIONS, {})

  const [checkActivityCodeExists] = useLazyQuery(CHECK_ACTIVITY_CODE_EXISTS, {
    onCompleted: data => {
      setActivityCheck(data.activitycodes.totalCount === activityCodes.length)
    }
  })

  async function updateInfo(data) {
    const updatedData = apiData.map(item => {
      const priceId = data.ratesetPrices.nodes.filter(obj => obj.activitycode.activityCode === item.code && obj.ratesetHeaderId === item.ratesetId)
      return ({
        ...item,
        ratesetPriceId: priceId.map(item => item.id)[0],
      })
    })
    setApiData(updatedData)
  }


  const handleUpload = (event) => {
    const file = event.target.files[0];
    readFile(file)
      .then((readData) => setInitialData(readData))
      .catch((error) => console.error(error));
  };

  const setData = () => {
    setApiData(generateObjects(importedData))
    const activityListSet = [...new Set(generateObjects(importedData).map((item) => item.code))];
    const activityList = Array.from(activityListSet)
    getActivityInfo({
      variables: {codes: activityList}
    })
  }


  function verifyData() {
    setApiData(generateObjects(importedData))
    const activityListSet = [...new Set(generateObjects(importedData).map((item) => item.code))];
    const activityList = Array.from(activityListSet)
    setActivityCodes(activityList)
    checkActivityCodeExists({
      variables: {codes: activityList}
    })
  }

  const compileApiData = async () => {

    const uniqueLocations = [...new Set(finalData.map((item) => item.reference))];
    const ratesetCodes = [...new Set(finalData.map((item) => ({code: item.code, rateset: item.ratesetId})))];

    console.log(uniqueLocations, ratesetCodes)


    /*ratesetCodes.forEach(item => getRatesetPrice({
      variables: {code: "KDCLR.12.1.11", rateset: 1}
    }))*/

    /*ratesetCodes.map(item => {
      getRatesetPrice({
        variables: {code: "KDCLR.12.1.11", rateset: 1}
      })
    })*/
    /*for (let i = 0; i < ratesetCodes.length; i++) {
      getRatesetPrice({
        variables: {code: ratesetCodes[i].code, rateset: ratesetCodes[i].ratesetId}
      })
    }*/

    const apiObject = uniqueLocations.map((item) => ({
      sitelocation: {
        reference: item,
        description: item,
        orderNumberId: gridSelectionsVar().selectedOrder,
        orderdetails: {
          create: finalData
            .filter((obj) => obj.reference === item)
            .map((item) => ({
              //	orderNumberId: gridSelectionsVar ().selectedOrder.id,
              itemNumber: item.itemNumber,
              activityPriceId: item.activityPriceId,
              itemTypeId: item.itemTypeId,
              packNumber: String(item.packNumber),
              materialsBaseValue: item.materialsBase,
              qtyOrdered: item.qtyOrdered,
            })),
        },
      },
    }));
    setMutationData(apiObject);
    alert('DATA VALIDATION COMPLETE');
  };

  const commitData = () => {
    /*mutationData.forEach((item) =>
      loadData({
        variables: {input: item},
      })
    );*/
    alert('DATA SUBMITTED');
  };

  const createLocations = async () => {
    const sitelocationSet = [...new Set(generateObjects(importedData).map((item) => item.reference))];
    const sitelocationList = Array.from(sitelocationSet)
    const apiObject = sitelocationList.map(item => ({
      reference: item,
      orderheaderId: gridSelectionsVar().selectedOrder
    }))

    await createSitelocation({variables: {mnSitelocation: apiObject}}).then(res => {
      console.log(res)
      getNewLocations()
    })
  }

  return (
    <>
      <div style={{margin: 10, fontWeight: 'bold', fontSize: 20}}>
        {header && header.orderheader.projectTitle}
      </div>
      <Box
        sx={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2}}
      >
        <Item>
          <input
            type='file'
            accept='.xlsx'
            onChange={handleUpload}
            id='upload'
            style={{display: 'none'}}
          />
          <label htmlFor='upload'>
            <UploadButton
              label='select file'
              disabled={initialData}
              onClick={() => document.getElementById('upload').click()}
            />
          </label>
        </Item>
        <Item>
          <UploadButton
            onClick={verifyData}
            label='verify data'
            // disabled={!initialData || mutationData.length !== 0}
            disabled={activityCheck || !initialData}
          />
        </Item>
        <Item>
          <UploadButton
            label='create locations'
            disabled={!activityCheck}
            onClick={createLocations}
          />
        </Item>
        <Item>
          <UploadButton
            label='submit data'
            disabled={!initialData || mutationData.length === 0}
            onClick={commitData}
          />
        </Item>
      </Box>
      {/*<Box display='flex' justifyContent='space-around' fontSize={18} fontWeight={500}>

        <div>{Object.entries(currentSheet).length !== 0 &&
        `ITEM COUNT: ${generateObjects(currentSheet).length}`}</div>
        <div> {mutationData.length > 0 && `LOCATION COUNT: ${mutationData.length}`}</div>
      </Box>*/}

      <ReactExcel
        initialData={initialData}
        onSheetUpdate={currentSheet => setImportedData(currentSheet)}
        activeSheetClassName='active-sheet'
        reactExcelClassName='react-excel'
      />
    </>
  );
};

export default ImportData;
