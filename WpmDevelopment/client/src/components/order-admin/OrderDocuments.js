import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { useParams } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActionArea,
} from '@mui/material';
import Typography from '@mui/material/Typography';

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
  <Card
    sx={{
      bgcolor: '#d0ddea',
      p: 2,
      mt: 1,
      ml: 1,
      mr: 1,
      width: 325,
    }}
    key={data.document.id}
  >
    <CardContent>
      <CardActionArea
        href={`http://192.168.0.17:5000/documents/${data.document.headerDocumentFile.id}`}
        target='_blank'
      >
        <CardHeader
          title={data.document.title}
          sx={{
            textDecoration: 'underline',
            mb: 2,
            color: 'navy',
            textTransform: 'uppercase',
          }}
        />
        <Document
          file={`http://192.168.0.17:5000/documents/${data.document.headerDocumentFile.id}`}
        >
          <Page pageNumber={1} width={300} />
        </Document>
      </CardActionArea>
    </CardContent>
  </Card>
);

const OrderDocuments = (props) => {
  const { orderId } = useParams();
  const { data, loading, error } = useQuery(GET_ORDER_DOCUMENTS, {
    variables: { orderId: Number(orderId) },
    fetchPolicy: 'network-only',
  });
  if (loading) return <CircularProgress />;

  return data.orderheaderDocuments.nodes.length > 0 ? (
    <Box
      sx={{
        display: 'flex',
        height: 580,
        justifyContent: 'space-evenly',
        mt: 10,
      }}
    >
      {data.orderheaderDocuments.nodes.map((item) => DocumentDisplay(item))}
    </Box>
  ) : (
    <div className='no-data-message'>
      NO DOCUMENTS ARE CURRENLTY ASSOCIATED WITH THIS ORDER
    </div>
  );
};

export default OrderDocuments;
