import React from 'react';
import {gql, useQuery} from '@apollo/client';
import {Document, Page, pdfjs} from 'react-pdf/dist/esm/entry.webpack';
import {useParams} from 'react-router-dom';
import {Box, Card, CardActionArea, CardContent, CircularProgress} from '@mui/material';
import Typography from '@mui/material/Typography';
import OrderDocumentButtons from "../button-bars/OrderDocumentButtons";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const GET_ORDER_DOCUMENTS = gql`
  query GetOrderDocuments($orderId: Int!) {
    orderheaderDocuments(filter: { orderheaderId: { equalTo: $orderId } }) {
      nodes {
        document {
          createdAt
          headerDocumentFile
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

    xs={'auto'}
    key={data.document.id}
  >
    <Card sx={{
      bgcolor: '#d0ddea',
      height: 600,
      // p: 2,
      ml: 1, mr: 1,

    }}>
      <CardActionArea
        href={`https://workpm.ddns.net/documents/${data.document.headerDocumentFile.id}`}
        target='_blank'
      >
        <Typography
          sx={{
            textDecoration: 'underline',
            mb: 1,
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
    fetchPolicy: 'network-only',
  });
  if (loading) return <CircularProgress/>;

  return (<>
    <OrderDocumentButtons/>
    {/* <Box sx={{
      height: 600,
      alignContent: 'center',
      display: 'grid',
      gridTemplateColumns:
        '      minmax(100px, 1fr)\n' +
        '      repeat(6, 1fr)'
    }}>*/}
    <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', mb: 2, height: 600}}>
      {data.orderheaderDocuments.nodes.length > 0 ? (

        data.orderheaderDocuments.nodes.map((item) => DocumentDisplay(item))
      ) : (
        <div className='no-data-message'>
          NO DOCUMENTS ARE CURRENLTY ASSOCIATED WITH THIS ORDER
        </div>)}

    </Box>

  </>)
};

export default OrderDocuments;
