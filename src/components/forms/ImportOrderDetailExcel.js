import { generateObjects, ReactExcel, readFile } from '@ramonak/react-excel';
import React, { useState } from 'react';
import UploadButton from '../ui-components/buttons/UploadButton';
import { useQuery, gql, useLazyQuery, useMutation } from '@apollo/client';
import { gridSelectionsVar } from '../../cache';
import { Box, CircularProgress } from '@mui/material';
import { useHistory } from "react-router-dom";


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

const CREATE_LOCATION_WITH_ORDERDETAIL = gql`
mutation CreateLocationWithDetail($input:  CreateSitelocationInput!) {
  createSitelocation(
    input: $input 
  ) {
    sitelocation {
      id
      reference
      orderdetailWithValues {
        nodes {
          activityCode
          activityDescription
          complete
          id
          itemNumber
          locationReference
          orderNumber
          projectTitle
          qtyApplied
          qtyComplete
          qtyOrdered
          qtyOs
          valueApplied
          valueComplete
          valueOs
          valuePayableTotal
          worksheetReference
        }
      }
    }
  }
}
`

const CHECK_ACTIVITY_CODE_EXISTS = gql`
  query CheckActivitycodeExists($codes: [String!]) {
    activitycodes(filter: {activityCode: {in: $codes}}) {
      nodes {
        id
         activityCode
         }
      totalCount
}
}
`

function Item(props) {
  const { sx, ...other } = props;
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
  const [apiData, setApiData] = useState([]);
  const [mutationData, setMutationData] = useState([]);
  const [importedData, setImportedData] = useState([])
  const [activityCodes, setActivityCodes] = useState([])
  const [activityCheck, setActivityCheck] = useState(false)
  const [counter, setCounter] = useState(1)

  const history = useHistory()




  const { data: header } = useQuery(GET_PROJECT_TITLE, {
    variables: { id: gridSelectionsVar().selectedOrder.id },

  });

  const [getActivityInfo] = useLazyQuery(GET_ACTIVITY_INFO, {
    onCompleted: data => {
      updateInfo(data)
    }
  })

  const [createSitelocationWithDetail, {

    loading: submittingData, networkStatus,

  }] = useMutation(CREATE_LOCATION_WITH_ORDERDETAIL, {
    notifyOnNetworkStatusChange: false,
    onCompleted: () => {

      setCounter(previousState => previousState + 1)

      if (mutationData.length === counter) {
        history.push('/orders')
      }

    }
  })

  const [checkActivityCodeExists] = useLazyQuery(CHECK_ACTIVITY_CODE_EXISTS, {
    onCompleted: data => {
      setActivityCheck(data.activitycodes.totalCount === activityCodes.length);
      getActivityInfo({
        variables: { codes: activityCodes }
      })
    }
  })

  function updateInfo(data) {
    const updatedData = apiData.map(item => {
      const priceId = data.ratesetPrices.nodes.filter(obj => obj.activitycode.activityCode === item.code && obj.ratesetHeaderId === item.ratesetId)
      return ({
        reference: item.reference,
        itemNumber: item.itemNumber,
        qtyOrdered: item.qtyOrdered,
        itemTypeId: item.itemTypeId,
        packNumber: item.packNumber,
        valueBaseMaterials: item.valueBaseMaterials,
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

  function verifyData() {
    setApiData(generateObjects(importedData))
    const activityListSet = [...new Set(generateObjects(importedData).map((item) => item.code))];
    const activityList = Array.from(activityListSet)
    setActivityCodes(activityList)
    checkActivityCodeExists({
      variables: { codes: activityList }
    })
  }

  async function handleSubmitData() {
    mutationData.forEach((item) => {
      createSitelocationWithDetail({
        variables: { input: item }
      })
    }
    )

  }

  const compileData = () => {
    const uniqueLocations = [...new Set(apiData.map((item) => item.reference))];
    const apiObject = uniqueLocations.map((item) => ({
      sitelocation: {
        reference: item,
        orderheaderId: gridSelectionsVar().selectedOrder.id,
        orderdetails: {
          create: apiData
            .filter((obj) => obj.reference === item)
            .map((item) => ({
              orderheaderId: gridSelectionsVar().selectedOrder.id,
              itemNumber: item.itemNumber,
              ratesetPriceId: item.ratesetPriceId,
              itemTypeId: item.itemTypeId,
              packNumber: String(item.packNumber),
              valueBaseMaterials: item.valueBaseMaterials,
              qtyOrdered: item.qtyOrdered,
            })),
        },
      },
    }));
    setMutationData(apiObject);

  }
  if (submittingData || networkStatus === 1) return <CircularProgress
    color='secondary'
    size={300}
    sx={{ p: 25 }} />

  return (
    <>
      <div style={{ margin: 10, fontWeight: 'bold', fontSize: 20 }}>
        {header && header.orderheader.projectTitle}
      </div>
      <Box
        sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2 }}
      >
        <Item>
          <input
            type='file'
            accept='.xlsx'
            onChange={handleUpload}
            id='upload'
            style={{ display: 'none' }}
          />
          <label htmlFor='upload'>
            <UploadButton
              label='select file'
              disabled={initialData !== undefined}
              onClick={() => document.getElementById('upload').click()}
            />
          </label>
        </Item>
        <Item>
          <UploadButton
            onClick={verifyData}
            label='verify data'
            disabled={initialData === undefined || activityCheck}
          />
        </Item>
        <Item>
          <UploadButton
            label='compile data'
            disabled={!activityCheck || mutationData.length > 0}
            onClick={compileData}
          />
        </Item>
        <Item>
          <UploadButton
            label='submit data'
            disabled={!initialData || mutationData.length === 0}
            onClick={handleSubmitData}
          />
        </Item>
      </Box>

      <Box display={'flex'} justifyContent={'space-between'} ml={5} mr={5} fontWeight={'bold'} fontSize={20}>
        <div>{`Item Count ${apiData.length}`}</div>
        <div>{`Location Count ${mutationData.length}`}</div>
      </Box>
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
