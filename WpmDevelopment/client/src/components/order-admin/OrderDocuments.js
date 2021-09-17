import React from 'react';
import {useQuery, gql} from '@apollo/client';
import {Document, Page} from 'react-pdf/dist/esm/entry.webpack';
import {useParams} from 'react-router-dom';
import {
    Box,
    CircularProgress,
    Card,
    CardContent,
    CardActionArea,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import OrderDocumentButtons from "../button-bars/OrderDocumentButtons";

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
            ml: 1, mr: 1,
            maxWidth: 378
        }}
        key={data.document.id}
    >
        <CardActionArea
            href={`http://192.168.0.17:5000/documents/${data.document.headerDocumentFile.id}`}
            target='_blank'
        >
            <Typography
                sx={{
                    textDecoration: 'underline',
                    mb: 1,
                    color: 'navy',
                    textTransform: 'uppercase',
                    fontSize: 18
                }}>{data.document.title}</Typography>


            <CardContent><Document
                file={`http://192.168.0.17:5000/documents/${data.document.headerDocumentFile.id}`}
            >
                <Page pageNumber={1} width={350}/>
            </Document></CardContent>


        </CardActionArea>

    </Card>
);

const OrderDocuments = (props) => {
    const {orderId} = useParams();
    const {data, loading, error} = useQuery(GET_ORDER_DOCUMENTS, {
        variables: {orderId: Number(orderId)},
        fetchPolicy: 'network-only',
    });
    if (loading) return <CircularProgress/>;

    return (<>
        <OrderDocumentButtons/>
        <Box sx={{height: 600, display: 'flex', mt: 5, mr: 1, ml: 1, justifyContent: 'center'}}>

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
