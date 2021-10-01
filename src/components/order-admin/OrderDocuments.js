import React from 'react';
import {gql, useQuery} from '@apollo/client';
import {Document, Page, pdfjs} from 'react-pdf/dist/esm/entry.webpack';
import {useParams} from 'react-router-dom';
import {Box, Card, CardActionArea, CardContent, CircularProgress} from '@mui/material';
import Typography from '@mui/material/Typography';
import OrderDocumentButtons from "../button-bars/OrderDocumentButtons";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const GET_ORDER_DOCUMENTS = gql`
  query GetOrderDocuments($orderId: Int!) {
    orderheaderDocuments(filter: { orderheaderId: { equalTo: $orderId } }) {
      nodes {
        document {
          createdAt
          headerDocumentFile
          global
          id
          title
        }
      }
      totalCount
    }
  }
`;

const DocumentDisplay = (data) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: "center",
      alignItems: "center",
      m: 0.5
    }}
    key={data.document.id}
    spacing={2}
  >
    <Card sx={{
      bgcolor: '#d0ddea',
      height: 525
    }}>
      <CardActionArea
        href={`https://workpm.ddns.net/documents/${data.document.headerDocumentFile.id}`}
        target='_blank'
      >
        <Typography
          sx={{
            textDecoration: 'underline',
            mb: 1,
            mt: 2,
            color: 'navy',
            textTransform: 'uppercase',
            fontSize: 18,
            maxHeight: 500
          }}>{data.document.title}</Typography>


        <CardContent><Document

          file={{url: `https://workpm.ddns.net/documents/${data.document.headerDocumentFile.id}`}}
        >
          <Page pageNumber={1} width={300}/>
        </Document></CardContent>


      </CardActionArea>

    </Card>
  </Box>
);

const OrderDocuments = () => {
  const {orderId} = useParams();
  const {data, loading} = useQuery(GET_ORDER_DOCUMENTS, {
    variables: {orderId: Number(orderId)},
    fetchPolicy: 'cache-and-network',
  });
  if (loading) return <CircularProgress/>;

  return (<>
    <OrderDocumentButtons data={data}/>
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'middle', maxHeight: '75vh'}}>
      {data.orderheaderDocuments.nodes.length > 0 ? (

        data.orderheaderDocuments.nodes.map((item) => DocumentDisplay(item))
      ) : (
        <div className='no-data-message'>
          NO DOCUMENTS ARE CURRENTLY ASSOCIATED WITH THIS ORDER
        </div>)}

    </Box>

  </>)
};

export default OrderDocuments;
