import React from 'react';
import SiteWorkbookCoverSheet from './SiteWorkbookCoverSheet';
import { PDFViewer } from '@react-pdf/renderer';
import { GET_SINGLE_ORDERHEADER } from "../../gql/queries/orderheaders";
import { useQuery } from "@apollo/client";
import { CircularProgress } from '@mui/material';


const SiteWorkbook = () => {
    const { data, loading } = useQuery(GET_SINGLE_ORDERHEADER, {
        variables: { id: 15 },

    })

    if (loading || !data) return <CircularProgress />
    return (
        <PDFViewer width={1500} height={1000}>
            <SiteWorkbookCoverSheet data={data.orderheaderWithValue} />
        </PDFViewer>
    );
};

export default SiteWorkbook;